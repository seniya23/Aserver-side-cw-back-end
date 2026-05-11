import alumniTable from "../models/alumniTable.js";
import userTable from "../models/userTable.js";


export function Createalumniprofile(req,res){

    if(!req.user){
        res.status(401).json({
            message: "Please Login"
        });
        return;
    }

    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const image = req.body.image;
    const employmentStartDate = req.body.employmentStartDate;
    const employmentEndDate = req.body.employmentEndDate;
    const shortCourse = req.body.shortCourse;
    const professionalLicences = req.body.professionalLicences;
    const professionalCertifications = req.body.professionalCertifications;
    const degrees = req.body.degrees;
    const linkedinUrl = req.body.linkedinUrl;
    const biography = req.body.biography;
    const industry = req.body.industry;
    const graduationYear = req.body.graduationYear;

    // Calculate profile completion percentage
    const profileData = {
        image,
        employmentStartDate,
        employmentEndDate,
        shortCourse,
        professionalLicences,
        professionalCertifications,
        degrees,
        linkedinUrl,
        biography,
        industry,
        graduationYear
    };
    const profileCompletionPercentage = calculateProfileCompletion(profileData);


    alumniTable.get(
        "SELECT * FROM alumni WHERE email = ?",[email],
        (err, user)=>{
            if(err){
                res.status(500).json({
                    message: "Database error"
                });
                return;
            }
            if(user){
                res.status(409).json({
                    message: "User already has a profile"
                });
                return;
            }


            alumniTable.run(
                `INSERT INTO alumni (email, firstName, lastName, image, employmentStartDate, employmentEndDate, shortCourses, professionalLicences, professionalCertifications, degrees, linkedinUrl, biography, profileCompletionPercentage, industry, graduationYear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [email, firstName, lastName, image, employmentStartDate, employmentEndDate, shortCourse, professionalLicences, professionalCertifications, degrees, linkedinUrl, biography, profileCompletionPercentage, industry, graduationYear],
                (err)=>{
                    if(err){
                        res.status(500).json({
                            message: "Profile creation error"
                        });
                        return;
                    }
                    userTable.run(
                        "UPDATE users SET role = 'alumni' WHERE email = ? AND role = 'user'",
                        [email],
                        (roleErr) => {
                            if (roleErr) {
                                res.status(500).json({
                                    message: "Profile created but failed to update account role"
                                });
                                return;
                            }
                            res.json({
                                message: "Alumni profile created successfully"
                            });
                        }
                    );
                }
            );
        }
    );
}


export function Getalumniprofile(req,res){
    const email  =  req.params.email;

    alumniTable.get(
        "SELECT * FROM alumni WHERE email = ?",[email],
        (err,user)=>{
            if(err){
                res.status(500).json({
                    massage : "Database error"
                })
                return
            }
            if(user){
                // recalculate completion to ensure it's up-to-date
                const computed = calculateProfileCompletion(user);
                if (computed !== user.profileCompletionPercentage) {
                    alumniTable.run(
                        "UPDATE alumni SET profileCompletionPercentage = ? WHERE email = ?",
                        [computed, email],
                        updateErr => {
                            if (updateErr) {
                                console.error("Failed to update completion percentage", updateErr);
                            }
                        }
                    );
                    user.profileCompletionPercentage = computed;
                }

                res.json({
                    massage : user
                });
                console.log(user);

            }else{
                if(!user){
                    res.status(404).json({ message: "User not found" });
                    return;
                }
            }
            
        }
    );
}

export function Updatealumniprofile(req, res) {
    if (!req.user) {
        res.status(401).json({ message: "Please login" });
        return;
    }

    const email = req.params.email;

   
    if (req.user.email !== email && req.user.role !== "admin") {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    alumniTable.get(
        "SELECT * FROM alumni WHERE email = ?", [email],
        (err, existing) => {
            if (err) {
                res.status(500).json({ message: "Database error" });
                return;
            }
            if (!existing) {
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            // merge incoming values with existing row
            const updated = {
                ...existing,
                ...req.body
            };

            
            const completion = calculateProfileCompletion(updated);

            alumniTable.run(
                `UPDATE alumni SET image = ?, employmentStartDate = ?, employmentEndDate = ?, shortCourses = ?, professionalLicences = ?, professionalCertifications = ?, degrees = ?, linkedinUrl = ?, biography = ?, profileCompletionPercentage = ?, industry = ?, graduationYear = ? WHERE email = ?`,
                [
                    updated.image || existing.image,
                    updated.employmentStartDate || existing.employmentStartDate,
                    updated.employmentEndDate || existing.employmentEndDate,
                    updated.shortCourses || existing.shortCourses,
                    updated.professionalLicences || existing.professionalLicences,
                    updated.professionalCertifications || existing.professionalCertifications,
                    updated.degrees || existing.degrees,
                    updated.linkedinUrl || existing.linkedinUrl,
                    updated.biography || existing.biography,
                    completion,
                    updated.industry || existing.industry,
                    updated.graduationYear || existing.graduationYear,
                    email
                ],
                (err) => {
                    if (err) {
                        res.status(500).json({ message: "Update error" });
                        return;
                    }
                    res.json({ message: "Profile updated successfully", profileCompletionPercentage: completion });
                }
            );
        }
    );
}


export function calculateProfileCompletion(alumniData) {
    const requiredFields = [
        'biography',
        'degrees',
        'linkedinUrl'
    ];

    const optionalFields = [
        'image',
        'employmentStartDate',
        'employmentEndDate',
        'shortCourses',
        'professionalLicences',
        'professionalCertifications',
        'industry',
        'graduationYear'
    ];

    let completedRequired = 0;
    let totalRequired = requiredFields.length;

    
    requiredFields.forEach(field => {
        if (alumniData[field] && typeof alumniData[field] === 'string' && alumniData[field].trim() !== '') {
            completedRequired++;
        }
    });

    
    let completionPercentage = (completedRequired / totalRequired) * 70; // 70% from required fields

    // Add points for optional fields (up to 30% bonus)
    let optionalCompleted = 0;
    optionalFields.forEach(field => {
        if (field === 'image') {
            // Special check for image must not be default
            if (alumniData[field] && typeof alumniData[field] === 'string' && alumniData[field].trim() !== '' && alumniData[field] !== 'default.jpg') {
                optionalCompleted++;
            }
        } else if (field === 'graduationYear') {
            // Special check for graduationYear (it's a number)
            if (alumniData[field] && alumniData[field] !== null && alumniData[field] !== '') {
                optionalCompleted++;
            }
        } else {
            // Regular check for other optional fields
            if (alumniData[field] && typeof alumniData[field] === 'string' && alumniData[field].trim() !== '') {
                optionalCompleted++;
            }
        }
    });

    // Add up to 30% bonus for optional fields
    completionPercentage += (optionalCompleted / optionalFields.length) * 30;

    return Math.min(Math.round(completionPercentage), 100);
}