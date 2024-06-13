



const services_frontend = {
    getCourses: async () => {
        const response = await axios.get('http://localhost:3000/getCourses');
        return response.data;
    },
    getLevels: async (courseId) => {
        const response = await axios.get(`http://localhost:3000/getLevels?courseId=${courseId}`);
        return response.data;
    },
    getLessons: async (courseId, levelId) => {
        const response = await axios.get(`http://localhost:3000/getLessions?courseId=${courseId}&levelId=${levelId}`);
        return response.data;
    },
    createSummary : async (user, inputs) =>{
        const body = {
            inputs : inputs,
            user: user,
        };
        const response = await fetch("http://localhost:3000/summary", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const answer = await response.json();
        return answer;
    }

}

document.addEventListener("DOMContentLoaded", async () => {
    const coursesSelect = document.getElementById('courses');
    const levelsSelect = document.getElementById('levels');
    const lessonsSelect = document.getElementById('lessons');
    const createSelect = document.getElementById('create');
    const createButton = document.getElementById('createBtn');
    const createSummary = document.getElementById('createSummary');


    // Load courses on page load
    try {
        const courses = await services_frontend.getCourses();
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.courseId;
            option.textContent = course.courseName;
            coursesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }

    // Handle course selection
    coursesSelect.addEventListener('change', async (event) => {
        const courseId = event.target.value;
        levelsSelect.innerHTML = '<option value="">Select a level</option>';
        lessonsSelect.innerHTML = '<option value="">Select a lesson</option>';
        levelsSelect.disabled = true;
        lessonsSelect.disabled = true;

        if (courseId) {
            try {
                const levels = await services_frontend.getLevels(courseId);
                levels.forEach(level => {
                    const option = document.createElement('option');
                    option.value = level.levelId;
                    option.textContent = level.levelName;
                    levelsSelect.appendChild(option);
                });
                levelsSelect.disabled = false;
            } catch (error) {
                console.error('Error loading levels:', error);
            }
        }
    });

    // Handle level selection
    levelsSelect.addEventListener('change', async (event) => {
        const courseId = coursesSelect.value;
        const levelId = event.target.value;
        lessonsSelect.innerHTML = '<option value="">Select a lesson</option>';
        lessonsSelect.disabled = true;

        if (courseId && levelId) {
            try {
                const lessons = await services_frontend.getLessons(courseId, levelId);
                lessons.forEach(lesson => {
                    const option = document.createElement('option');
                    option.value = lesson.lessionName;
                    option.textContent = lesson.lessionName;
                    lessonsSelect.appendChild(option);
                });
                lessonsSelect.disabled = false;
            } catch (error) {
                console.error('Error loading lessons:', error);
            }
        }else{
            document.getElementById('createSection').style.display = 'none';
        }
    });

    lessonsSelect.addEventListener('change', (event) => {
        const lessonId = event.target.value;
        if (lessonId) document.getElementById('createSection').style.display = 'flex';
        else document.getElementById('createSection').style.display = 'none';
    });

    createButton.addEventListener('click', async () => {
        const create = createSelect.value
        if (!create) return alert('Please select a create');
        const user = 'vanmerr020403@gmail.com';
        const inputs = {
            "LessonProgress": lessonsSelect.value
        }
        if(create === 'summary'){
            createSummary.style.display = 'block';
            createSummary.textContent = "Creating...........";
            const answer = await services_frontend.createSummary(user, inputs);
            console.log(answer);
            createLessonElements(answer.data.outputs.result);
        };
    
    });

});

function createLessonElements(lessonData) {
    const createSummary = document.getElementById('createSummary');
    createSummary.innerHTML = ''; // Clear previous content

    // Create elements for each part of the lesson
    const title = document.createElement('h2');
    title.textContent = `Học phần: ${lessonData["Học phần"]} - Bài: ${lessonData["Bài"]}`;
    createSummary.appendChild(title);

    const projectTitle = document.createElement('h3');
    projectTitle.textContent = `Tên dự án: ${lessonData["Tên dự án"]}`;
    createSummary.appendChild(projectTitle);

    const description = document.createElement('p');
    description.textContent = `Mô tả dự án: ${lessonData["Mô tả dự án"]}`;
    createSummary.appendChild(description);

    const topic = document.createElement('p');
    topic.textContent = `Chủ đề: ${lessonData["Chủ đề"]}`;
    createSummary.appendChild(topic);

    const newKnowledgeTitle = document.createElement('h4');
    newKnowledgeTitle.textContent = 'Kiến thức mới:';
    createSummary.appendChild(newKnowledgeTitle);

    const newKnowledgeList = document.createElement('ul');
    lessonData["Kiến thức mới"].forEach(knowledge => {
        const listItem = document.createElement('li');
        listItem.textContent = knowledge;
        newKnowledgeList.appendChild(listItem);
    });
    createSummary.appendChild(newKnowledgeList);

    const steamTitle = document.createElement('h4');
    steamTitle.textContent = 'Kiến thức theo STEAM:';
    createSummary.appendChild(steamTitle);

    const steamSections = lessonData["Kiến thức theo STEAM"];
    for (const section in steamSections) {
        const sectionTitle = document.createElement('h5');
        sectionTitle.textContent = section;
        createSummary.appendChild(sectionTitle);

        const sectionList = document.createElement('ul');
        for (const item in steamSections[section]) {
            const listItem = document.createElement('li');
            listItem.textContent = `${item}: ${steamSections[section][item]}`;
            sectionList.appendChild(listItem);
        }
        createSummary.appendChild(sectionList);
    }

    const stepsTitle = document.createElement('h4');
    stepsTitle.textContent = 'Chi tiết các bước:';
    createSummary.appendChild(stepsTitle);

    const steps = lessonData["Chi tiết các bước"];
    for (const step in steps) {
        const stepContainer = document.createElement('div');
        stepContainer.classList.add('step-container');

        const stepTitle = document.createElement('h5');
        stepTitle.textContent = `${step}: ${steps[step]["Nội dung"]}`;
        stepContainer.appendChild(stepTitle);

        const stepDescription = document.createElement('p');
        stepDescription.textContent = steps[step]["Mô tả"];
        stepContainer.appendChild(stepDescription);

        const stepTime = document.createElement('p');
        stepTime.textContent = `Thời gian: ${steps[step]["Thời gian"]}`;
        stepContainer.appendChild(stepTime);

        if (steps[step]["Kiến thức mới"].length > 0) {
            const stepNewKnowledgeTitle = document.createElement('h6');
            stepNewKnowledgeTitle.textContent = 'Kiến thức mới:';
            stepContainer.appendChild(stepNewKnowledgeTitle);

            const stepNewKnowledgeList = document.createElement('ul');
            steps[step]["Kiến thức mới"].forEach(knowledge => {
                const listItem = document.createElement('li');
                listItem.textContent = knowledge;
                stepNewKnowledgeList.appendChild(listItem);
            });
            stepContainer.appendChild(stepNewKnowledgeList);
        }

        if (steps[step]["Kiến thức cũ"].length > 0) {
            const stepOldKnowledgeTitle = document.createElement('h6');
            stepOldKnowledgeTitle.textContent = 'Kiến thức cũ:';
            stepContainer.appendChild(stepOldKnowledgeTitle);

            const stepOldKnowledgeList = document.createElement('ul');
            steps[step]["Kiến thức cũ"].forEach(knowledge => {
                const listItem = document.createElement('li');
                listItem.textContent = knowledge;
                stepOldKnowledgeList.appendChild(listItem);
            });
            stepContainer.appendChild(stepOldKnowledgeList);
        }

        createSummary.appendChild(stepContainer);
    }

    const homeworkTitle = document.createElement('h4');
    homeworkTitle.textContent = 'Bài tập tự luyện:';
    createSummary.appendChild(homeworkTitle);

    const homeworkList = document.createElement('ul');
    for (const homework in lessonData["Bài tập tự luyện"]) {
        const listItem = document.createElement('li');
        listItem.textContent = `${homework}: ${lessonData["Bài tập tự luyện"][homework]}`;
        homeworkList.appendChild(listItem);
    }
    createSummary.appendChild(homeworkList);
}