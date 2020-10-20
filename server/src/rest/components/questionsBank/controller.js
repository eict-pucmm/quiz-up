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
  let orderedPoints = { oneH: [], twoH: [], threeH: [], fourH: [], fiveH: [] };
  questions.forEach((question, index) => {
    let arr = [];
    console.log('QUESTIONS !!!!', question);
    if (question.points == 100) {
      orderedPoints.oneH.push(question);
    } else if (question.points == 200) {
      orderedPoints.twoH.push(question);
    } else if (question.points == 300) {
      orderedPoints.threeH.push(question);
    } else if (question.points == 400) {
      orderedPoints.fourH.push(question);
    } else if (question.points == 500) {
      orderedPoints.fiveH.push(question);
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
