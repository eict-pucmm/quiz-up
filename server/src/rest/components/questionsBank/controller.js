import Question from '../question/model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  NO_CONTENT,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';

const create = async (req, res) => {
  const { categories } = req.body;
  const regex = categories.join('|');

  const [error, questions] = await wrapper(
    Question.find({
      categories: { $regex: regex },
    })
  );

  const qbank = createQuestionBank(questions);

  return error
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating questionBank', error: error })
    : res.status(CREATED).json({ qbank });
};

const createQuestionBank = questions => {
  let orderedPoints = {};
  questions.forEach((question, index) => {
    let arr = [];
    console.log('QUESTIONS !!!!', question);
    if (question.points == 100) {
      orderedPoints.oneH = { ...orderedPoints.oneH };
    } else if (question.points == 200) {
      orderedPoints['200 pts'] = question;
    } else if (question.points == 300) {
      orderedPoints['300 pts'] = question;
    } else if (question.points == 400) {
      orderedPoints['400 pts'] = question;
    } else if (question.points == 500) {
      orderedPoints['500 pts'] = question;
    }

    console.log('>>>>>>>>>>>>>>>>>\n', orderedPoints.oneH);
  });
  console.table(orderedPoints);
  return orderedPoints;
};

/* THIS FUNCTION WILL HELP GET ONE RANDOM QUESTION FROM THE ORDERED BY POINTS QUESTIONS*/

// function pickRandomQuestion() {
//     var obj_keys = Object.keys(window.questionnaire);
//     var ran_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];
//     window.selectedquestion = window.questionnaire[ran_key];
//     console.log(window.selectedquestion);
//     console.log(window.questionnaire);
// }

export { create };
