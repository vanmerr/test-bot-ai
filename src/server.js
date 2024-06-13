const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const services = require('./services-backend');
const data = require('./data.json');

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getCourses', (req, res) => {
  const courses =  data.courses.map(course => 
    ({
      courseId: course.courseId,
      courseName: course.courseName,
      courseDescription: course.courseDescription
    })
  )
   res.send(courses);
});

app.get('/getLevels', async (req, res) => {
  const courseId = parseInt(req.query.courseId);
  
  if (isNaN(courseId)) {
    return res.status(400).send({ message: 'Invalid courseId' });
  }

  const course = data.courses.find(course => course.courseId === courseId);

  if (!course) {
    return res.status(404).send({ message: 'Course not found' });
  }

  const levels = course.courseLevels.map(level => ({
    levelId: level.levelId,
    levelName: level.levelName,
    levelDescription: level.levelDescription
  }));

  res.send(levels);
});

app.get('/getLessions', async (req, res) => {
  const courseId = parseInt(req.query.courseId);
  const levelId = parseInt(req.query.levelId);

  if (isNaN(courseId) || isNaN(levelId)) {
    return res.status(400).send({ message: 'Invalid courseId or levelId' });
  }

  const course = data.courses.find(course => course.courseId === courseId);

  if (!course) {
    return res.status(404).send({ message: 'Course not found' });
  }

  const level = course.courseLevels.find(level => level.levelId === levelId);

  if (!level) {
    return res.status(404).send({ message: 'Level not found' });
  }

  const lessions = level.levelLessionss.map(lession => ({
    lessionId: lession.lessionId,
    lessionName: lession.lessionName,
    lessionDescription: lession.lessionDescription
  }));

  res.send(lessions);
});
app.post('/summary', async (req, res) => {
    //Lấy dữ liệu từ client
    const data = req.body;

    //Kiểm tra user trên firebase và nếu trả kết quả đúng thì gọi đến chat AI
    const answer = await services.summaryService(data.user, data.inputs)
    //Trả về kết quả cho client
    res.send(answer);
  
  });


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
