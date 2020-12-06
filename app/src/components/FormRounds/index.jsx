import React, { useEffect, useState } from 'react';
import { Form, notification, Button, Steps } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import {
  addRound,
  clearRoundFields,
  setRoundAttributes,
} from '../../state/actions';
import { useStateValue } from '../../state';
import { getCategories } from '../../api/categories';
import { getTeams } from '../../api/teams';
import { saveRound, updateRound } from '../../api/round';
import MyModal from '../MyModal';
import GeneralData from './GeneralData';
import QuestionBank from './QuestionBank';
import BonusQuestion from './BonusQuestion';

import './styles.css';

const { Step } = Steps;

export const SHARED_PROPS = {
  showArrow: true,
  mode: 'multiple',
  optionFilterProp: 'children',
  filterOption: (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
};

const FormRounds = ({ gameEvent, showInfo, form, ...props }) => {
  const {
    dispatch,
    state: { roundToAdd, round, viewOldEvents },
  } = useStateValue();
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
  const { errorName, errorCategories, errorTeams, questionBank } = roundToAdd;
  const { errorQuestionBank, errorBonusQuestion } = roundToAdd;
  const { editing } = round;
  const [allCategories, setAllCategories] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await getCategories();
      setAllCategories(data || []);
    };

    const loadTeams = async () => {
      const { data } = await getTeams();
      setAllTeams(data);
    };

    loadCategories();
    loadTeams();
  }, []);

  const nextStep = () => {
    //check for errors on step change
    const errCat = errorCategories || roundToAdd.categories.length < 4;
    const errTeams =
      errorTeams || roundToAdd.participants.map(({ team }) => team).length < 4;
    const errName = errorName || roundToAdd.name.length < 3;

    const notEnoughQuestions =
      currentStep === 1 &&
      (errorQuestionBank ||
        Object.values(roundToAdd.questionBank).some(v => v.length < 5));

    const errBonus =
      currentStep === 2 &&
      (errorBonusQuestion || roundToAdd.bonusQuestion === '');

    dispatch(
      addRound({
        errorName: errName,
        errorCategories: errCat,
        errorTeams: errTeams,
        errorQuestionBank: notEnoughQuestions,
        errorBonusQuestion: errBonus,
      })
    );

    if (errName || errCat || errTeams || notEnoughQuestions || errBonus) {
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    //when going back a step, dismiss prevous errors
    dispatch(
      addRound({
        errorQuestionBank: false,
        errorBonusQuestion: false,
      })
    );

    setCurrentStep(currentStep - 1);
  };

  const clearAll = () => {
    setCurrentStep(0);
    form.resetFields();
    dispatch(clearRoundFields());
    dispatch(setRoundAttributes({ saving: false, nameChanged: false }));
  };

  const clearAndReturn = error => {
    if (error) {
      return notification['error']({
        message:
          error.status === 409
            ? '¡Ya existe una ronda con ese nombre!'
            : '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
      });
    }

    //clear form and reset state
    clearAll();

    return notification['success']({
      message: `La ronda ha sido ${
        showInfo ? 'actualizada' : 'creada'
      } con exito`,
    });
  };

  const onSubmit = async () => {
    if (
      errorName ||
      errorCategories ||
      errorTeams ||
      errorQuestionBank ||
      errorBonusQuestion ||
      roundToAdd.bonusQuestion === ''
    ) {
      return notification['error']({
        message: 'Por favor revise los datos de la ronda.',
      });
    }

    dispatch(setRoundAttributes({ saving: true }));

    const ROUND_INFO = {
      ...roundToAdd,
      questionBank: Object.values(questionBank).flat(),
    };

    if (showInfo) {
      if (!round.nameChanged) delete ROUND_INFO.name;
      const { error: e } = await updateRound(round.roundId, {
        ...ROUND_INFO,
        event: gameEvent._id,
        bonusQuestion: roundToAdd.bonusQuestion._id || roundToAdd.bonusQuestion,
      });
      //close modal after submitting
      props.onCancel();
      return clearAndReturn(e);
    }

    const { error } = await saveRound({
      round: ROUND_INFO,
      event: gameEvent._id,
    });

    clearAndReturn(error);
    //close modal after submitting
    props.onCancel();
  };

  const STEPS = {
    0: () => (
      <GeneralData
        form={form}
        showInfo={showInfo}
        allCategories={allCategories}
        allTeams={allTeams}
      />
    ),
    1: () => <QuestionBank form={form} allCategories={allCategories} />,
    2: () => <BonusQuestion form={form} />,
  };

  return (
    <MyModal
      {...props}
      onCancel={() => {
        props.onCancel();
        setCurrentStep(0);
      }}
      form={form}
      onSubmit={onSubmit}
      saving={round.saving}
      steps={{ next: nextStep, prev: prevStep, current: currentStep }}
      type="Ronda"
      editing={editing}
      title={
        editing
          ? `Editar ronda del evento: ${gameEvent.name}`
          : `Agregar nueva ronda al evento: ${gameEvent.name}`
      }>
      {isDesktopOrLaptop && (
        <Steps current={currentStep} size="small" className="round-modal-steps">
          {['Datos Generales', 'Banco de Preguntas', 'Pregunta Bono'].map(t => (
            <Step key={t} title={t} />
          ))}
        </Steps>
      )}
      {showInfo && !roundToAdd.finished && (
        <Link to={viewOldEvents ? '#' : `/event/round/${round.roundId}`}>
          <Button className="mb-15" type="primary" block>
            Empezar Ronda
          </Button>
        </Link>
      )}
      <Form form={form} labelCol={{ span: 12 }} layout="vertical" size="medium">
        {STEPS[currentStep]}
      </Form>
    </MyModal>
  );
};

export default FormRounds;
