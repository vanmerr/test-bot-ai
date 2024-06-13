



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


    const rawData = `Học phần: 1**
    **Bài: 3**
    **Tên dự án: CHƯỚNG NGẠI VẬT ĐẶC BIỆT - P1**
    **Mô tả dự án:** "Chướng ngại vật đặc biệt - phần 1" là dạng chướng ngại vật tác động lực lên người chơi khiến người chơi khó điều khiển nhân vật và dễ rơi vào bẫy.
    **Chủ đề:** Không gian 2 chiều, 3 chiều, 4 chiều
    **Kiến thức trong bài:** 
    - Hệ trục tọa độ Oxyz trong Roblox Studio
    - Thuộc tính Velocity của vật thể
    - Các hiệu ứng với vật thể / nhóm vật thể: Fire, Smoke, SpotLight, SurfaceLight, Sparkles, ParticleEmitter,...
    `; // Truncated for brevity

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
            createSummary.textContent = "";
            const projects = parseData(answer.data.outputs.rs);
            projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';
            projectDiv.innerHTML = `
                <h3>${project.title}</h3>
                <p><strong>Học phần:</strong> ${project.course}</p>
                <p><strong>Bài:</strong> ${project.lesson}</p>
                <p><strong>Mô tả dự án:</strong> ${project.description}</p>
                <p><strong>Chủ đề:</strong> ${project.topic}</p>
                <p><strong>Kiến thức trong bài:</strong></p>

            `;
            createSummary.appendChild(projectDiv);
        });
    };

    function parseData(data) {
        const projects = [];
        const projectStrings = data.split('\n\n').filter(item => item.trim().length);
        projectStrings.forEach(str => {
            const project = {};
            const lines = str.split('\n').filter(line => line.trim().length);
            lines.forEach(line => {
                const [key, value] = line.split(': ').map(item => item.trim());
                if (key === 'Học phần') project.course = value;
                else if (key === 'Bài') project.lesson = value;
                else if (key === 'Tên dự án') project.title = value;
                else if (key === 'Mô tả dự án') project.description = value;
                else if (key === 'Chủ đề') project.topic = value;
                else if (key === 'Kiến thức trong bài') {
                    project.knowledge = lines.slice(lines.indexOf(line) + 1)
                        .filter(item => item.startsWith('- '))
                        .map(item => item.replace('- ', ''));
                }
            });
            projects.push(project);
        });
        return projects;
    }

});


});