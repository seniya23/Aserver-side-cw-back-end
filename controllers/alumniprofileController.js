import alumniTable from "../models/alumniTable.js";
import { calculateProfileCompletion as computeProfileCompletion } from "../utils/profileCompletion.js";


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

    // build object to calculate completion percentage
    const alumniData = {
        image,
        employmentStartDate,
        employmentEndDate,
        shortCourses: shortCourse,
        professionalLicences,
        professionalCertifications,
        degrees,
        linkedinUrl,
        biography
    };
    const profileCompletionPercentage = computeProfileCompletion(alumniData);


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
                `INSERT INTO alumni (email, firstName, lastName, image, employmentStartDate, employmentEndDate, shortCourses, professionalLicences, professionalCertifications, degrees, linkedinUrl, biography, profileCompletionPercentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [email, firstName, lastName, image, employmentStartDate, employmentEndDate, shortCourse, professionalLicences, professionalCertifications, degrees, linkedinUrl, biography, profileCompletionPercentage],
                (err)=>{
                    if(err){
                        res.status(500).json({
                            message: "Profile creation error"
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
            }
            console.log(user);
}
    )}

export function Updatealumniprofile(req, res) {
    if (!req.user) {
        res.status(401).json({ message: "Please login" });
        return;
    }

    const email = req.params.email;

    // only owner or admin can update
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

            // calculate new completion percentage
            const completion = computeProfileCompletion(updated);

            alumniTable.run(
                `UPDATE alumni SET image = ?, employmentStartDate = ?, employmentEndDate = ?, shortCourses = ?, professionalLicences = ?, professionalCertifications = ?, degrees = ?, linkedinUrl = ?, biography = ?, profileCompletionPercentage = ? WHERE email = ?`,
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
        'professionalCertifications'
    ];

    let completedRequired = 0;
    let totalRequired = requiredFields.length;

    // Check required fields (firstName and lastName are already required in table creation)
    requiredFields.forEach(field => {
        if (alumniData[field] && alumniData[field].trim() !== '') {
            completedRequired++;
        }
    });

    // Calculate base completion from required fields
    let completionPercentage = (completedRequired / totalRequired) * 70; // 70% from required fields

    // Add points for optional fields (up to 30% bonus)
    let optionalCompleted = 0;
    optionalFields.forEach(field => {
        if (field === 'image') {
            // Special check for image - must not be default
            if (alumniData[field] && alumniData[field].trim() !== '' && alumniData[field] !== 'default.jpg') {
                optionalCompleted++;
            }
        } else {
            // Regular check for other optional fields
            if (alumniData[field] && alumniData[field].trim() !== '') {
                optionalCompleted++;
            }
        }
    });

    // Add up to 30% bonus for optional fields
    completionPercentage += (optionalCompleted / optionalFields.length) * 30;

    return Math.min(Math.round(completionPercentage), 100);
}