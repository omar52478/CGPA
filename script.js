var subjectGPA = [];
var grade = [];
var totalGPA = 0;
var totalSubjects = 0;
var totalPercentage = 0;
var check = 0;

// خريطة تحويل الحروف إلى النقاط والنسبة المئوية
const gradeToGPA = {
    '4.0': { gpa: 4.0, percentage: 96 },
    '3.7': { gpa: 3.7, percentage: 92 },
    '3.4': { gpa: 3.4, percentage: 88 },
    '3.2': { gpa: 3.2, percentage: 84 },
    '3.0': { gpa: 3.0, percentage: 80 },
    '2.8': { gpa: 2.8, percentage: 76 },
    '2.6': { gpa: 2.6, percentage: 72 },
    '2.4': { gpa: 2.4, percentage: 68 },
    '2.2': { gpa: 2.2, percentage: 64 },
    '2.0': { gpa: 2.0, percentage: 60 },
    '1.5': { gpa: 1.5, percentage: 55 },
    '1.0': { gpa: 1.0, percentage: 50 },
    '0': { gpa: 0.0, percentage: 0 }
};

function calculate() {
    totalSubjects = 0;
    totalPercentage = 0;
    subjectGPA = [];
    grade = [];

    for (var i = 1; i <= 7; i++) {
        const gradeInput = document.getElementById('inputm' + i).value;
        if (gradeInput && gradeToGPA.hasOwnProperty(gradeInput)) {
            totalSubjects++;
            subjectGPA.push(gradeToGPA[gradeInput].gpa);
            grade.push(gradeInput);
            totalPercentage += gradeToGPA[gradeInput].percentage;
        }
    }

    if (totalSubjects === 0) {
        alert("Please select grades for at least one subject.");
        return;
    }

    totalPercentage /= totalSubjects;
    showResult();
}

function showResult() {
    var totalHours = 0;
    var gpaSum = 0;

    for (var i = 1; i <= totalSubjects; i++) {
        const creditHour = parseInt(document.getElementById('hours' + i).value);
        totalHours += creditHour;
        gpaSum += creditHour * subjectGPA[i - 1];

        document.getElementById('grade' + i).innerHTML = gradeToGPA[grade[i - 1]].percentage.toFixed(2);
        document.getElementById('gpaOfSbj' + i).innerHTML = subjectGPA[i - 1].toFixed(2);
    }

    totalGPA = gpaSum / totalHours;

    document.getElementById('showPercentage').innerHTML = "Percentage: " + totalPercentage.toFixed(2) + "%";
    document.getElementById('showGPA').innerHTML = "GPA: " + totalGPA.toFixed(3);
}

function switchbtn() {
    if (check === 0) {
        document.getElementById('gpaBox').style.display = "none";
        document.getElementById('cgpaBox').style.display = "block";
        document.getElementById('main-heading').innerHTML = "CGPA Calculator";
        document.getElementById('switchh').innerHTML = "GPA";
        check = 1;
    } else {
        document.getElementById('gpaBox').style.display = "block";
        document.getElementById('cgpaBox').style.display = "none";
        document.getElementById('main-heading').innerHTML = "GPA Calculator";
        document.getElementById('switchh').innerHTML = "CGPA";
        check = 0;
    }
}

function calculateCGPA() {
    var totalSemesters = 0;
    var cgpaSum = 0;

    for (var i = 1; i <= 8; i++) {
        const semesterInput = document.getElementById('inputgpa' + i).value.trim();
        if (semesterInput && !isNaN(parseFloat(semesterInput))) {
            cgpaSum += parseFloat(semesterInput);
            totalSemesters++;
        }
    }

    if (totalSemesters === 0) {
        alert("Please enter GPA values for at least one semester.");
        return;
    }

    const cgpa = cgpaSum / totalSemesters;
    document.getElementById('showCGPA').innerHTML = "CGPA: " + cgpa.toFixed(3);
}
