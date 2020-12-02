import Question from '../question/model';

import { INTERNAL_SERVER_ERROR, CREATED } from '../../../config/statusCodes';
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
  questions.forEach(question => {
    Object.keys(categories).forEach(key => {
      const categorySelected = question.categories.find(c => c === key);
      if (question.categories.includes(key)) {
        const objFormat = {
          name: question.name,
          points: question.points,
          category: question.categories,
          _id: question._id,
          categorySelected,
        };
        categories[key].push(objFormat);
      }
    });
  });

  return pickRandomQuestion(categories);
};

/* THIS FUNCTION WILL HELP GET ONE RANDOM QUESTION FROM THE ORDERED BY POINTS QUESTIONS*/
function pickRandomQuestion(categories) {
  let questionBank = {};
  let actualCatQuestions = {
    oneH: [],
    twoH: [],
    threeH: [],
    fourH: [],
    fiveH: [],
  };

  Object.keys(categories).forEach(key => {
    questionBank[key] = [];
  });

  for (let [key, val] of Object.entries(categories)) {
    let repeated = false;
    val.forEach(question => {
      if (question.category.length > 1) {
        question.category.forEach(category => {
          if (!Object.keys(categories).includes(category)) return;
          const bankCat = questionBank[category];
          Object.values(bankCat).forEach(val => {
            if (val && val._id === question._id) {
              repeated = true;
              return;
            }
          });
        });
      }

      if (question.isBonus) {
        return;
      }

      if (!repeated) {
        if (question.points === 100) {
          actualCatQuestions.oneH.push(question);
        } else if (question.points === 200) {
          actualCatQuestions.twoH.push(question);
        } else if (question.points === 300) {
          actualCatQuestions.threeH.push(question);
        } else if (question.points === 400) {
          actualCatQuestions.fourH.push(question);
        } else if (question.points === 500) {
          actualCatQuestions.fiveH.push(question);
        }
      }
    });

    questionBank[key].push(
      actualCatQuestions.oneH[
        Math.floor(Math.random() * actualCatQuestions.oneH.length)
      ] || {}
    );
    questionBank[key].push(
      actualCatQuestions.twoH[
        Math.floor(Math.random() * actualCatQuestions.twoH.length)
      ] || {}
    );
    questionBank[key].push(
      actualCatQuestions.threeH[
        Math.floor(Math.random() * actualCatQuestions.threeH.length)
      ] || {}
    );
    questionBank[key].push(
      actualCatQuestions.fourH[
        Math.floor(Math.random() * actualCatQuestions.fourH.length)
      ] || {}
    );
    questionBank[key].push(
      actualCatQuestions.fiveH[
        Math.floor(Math.random() * actualCatQuestions.fiveH.length)
      ] || {}
    );

    actualCatQuestions = {
      oneH: [],
      twoH: [],
      threeH: [],
      fourH: [],
      fiveH: [],
    };
  }

  return questionBank;
}
export { create };
