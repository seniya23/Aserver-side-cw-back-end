// utility for computing alumni profile completion percentage

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
