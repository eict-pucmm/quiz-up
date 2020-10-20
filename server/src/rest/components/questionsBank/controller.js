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
  const orderedByCategories = {
    [categories[0]]: [],
    [categories[1]]: [],
    [categories[2]]: [],
    [categories[3]]: [],
  };

  const qbank = createQuestionBank(questions, orderedByCategories);

  return error
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating questionBank', error: error })
    : res.status(CREATED).json({ qbank });
};

const createQuestionBank = (questions, categories) => {
  let orderedPoints = { oneH: [], twoH: [], threeH: [], fourH: [], fiveH: [] };
  questions.forEach((question, index) => {
    Object.keys(categories).forEach(key => {
      if (question.categories.includes(key)) {
        let objFormat = {
          name: question.name,
          points: question.points,
          category: question.categories,
          _id: question._id,
        };
        categories[key].push(objFormat);
      }
    });
  });

  return pickRandomQuestion(categories);
};

/* THIS FUNCTION WILL HELP GET ONE RANDOM QUESTION FROM THE ORDERED BY POINTS QUESTIONS*/

function pickRandomQuestion(categories) {
  console.log(categories);

  let questionBank = {};
  let actualCatQuestions = {
    oneH: [],
    twoH: [],
    threeH: [],
    fourH: [],
    fiveH: [],
  };

  Object.keys(categories).forEach(key => {
    questionBank[key] = {
      oneH: [],
      twoH: [],
      threeH: [],
      fourH: [],
      fiveH: [],
    };
  });

  for (let [key, val] of Object.entries(categories)) {
    val.forEach(question => {
      if (question.points == 100) {
        actualCatQuestions.oneH.push(question);
      } else if (question.points == 200) {
        actualCatQuestions.twoH.push(question);
      } else if (question.points == 300) {
        actualCatQuestions.threeH.push(question);
      } else if (question.points == 400) {
        actualCatQuestions.fourH.push(question);
      } else if (question.points == 500) {
        actualCatQuestions.fiveH.push(question);
      }
    });

    questionBank[key].oneH =
      actualCatQuestions.oneH[
        Math.floor(Math.random() * actualCatQuestions.oneH.length)
      ];
    questionBank[key].twoH =
      actualCatQuestions.twoH[
        Math.floor(Math.random() * actualCatQuestions.twoH.length)
      ];
    questionBank[key].threeH =
      actualCatQuestions.threeH[
        Math.floor(Math.random() * actualCatQuestions.threeH.length)
      ];
    questionBank[key].fourH =
      actualCatQuestions.fourH[
        Math.floor(Math.random() * actualCatQuestions.fourH.length)
      ];
    questionBank[key].fiveH =
      actualCatQuestions.fiveH[
        Math.floor(Math.random() * actualCatQuestions.fiveH.length)
      ];
    console.log('SUPPOSED QUESTION SELECTED >>>>\n\n', questionBank);

    actualCatQuestions = {
      oneH: [],
      twoH: [],
      threeH: [],
      fourH: [],
      fiveH: [],
    };
  }

  console.log(
    '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\n'
  );
  console.log(questionBank);

  return questionBank;
}
export { create };
