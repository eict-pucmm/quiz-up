import React, { useEffect, useState } from 'react';
import { Form, notification, Button, Steps } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { clearRoundFields, setRoundAttributes } from '../../state/actions';
import { useStateValue } from '../../state';
import { getCategories } from '../../api/categories';
import { getTeams } from '../../api/teams';
import { saveRound } from '../../api/round';
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

const FormRounds = ({ gameEvent, showInfo, ...props }) => {
  const {
    dispatch,
    state: { roundToAdd, round, viewOldEvents },
  } = useStateValue();
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
  const { errorName, errorCategories, errorTeams } = roundToAdd;
  const [allCategories, setAllCategories] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

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
    if (errorCategories || roundToAdd.categories.length === 0) return;
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async () => {
    if (errorName || errorCategories || errorTeams) {
      return notification['error']({
        message: 'Por favor revise los datos de la ronda.',
      });
    }

    dispatch(setRoundAttributes({ saving: true }));

    const { error } = await saveRound({
      round: roundToAdd,
      event: gameEvent._id,
    });

    if (error) {
      dispatch(setRoundAttributes({ saving: false }));
      return notification['error']({
        message:
          '¡Oh no! Ha ocurrido un error con el servidor. Favor de comunicarse con su administrador.',
      });
    }

    notification['success']({
      message: 'El evento ha sido creada con exito',
    });

    dispatch(clearRoundFields());
    dispatch(setRoundAttributes({ saving: false }));
    //close modal after submitting
    props.onCancel();
  };

  const STEPS = {
    0: () => (
      <GeneralData
        form={form}
        allCategories={allCategories}
        allTeams={allTeams}
      />
    ),
    1: () => <QuestionBank />,
    2: () => <BonusQuestion />,
  };

  return (
    <MyModal
      {...props}
      form={form}
      onSubmit={onSubmit}
      saving={round.saving}
      steps={{ next: nextStep, prev: prevStep, current: currentStep }}
      type="Ronda"
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}>
      {isDesktopOrLaptop && (
        <Steps current={currentStep} size="small" className="round-modal-steps">
          {['Datos Generales', 'Banco de Preguntas', 'Pregunta Bono'].map(t => (
            <Step key={t} title={t} />
          ))}
        </Steps>
      )}
      {showInfo && (
        <Link to={viewOldEvents ? '#' : `/event/round/${round._id}`}>
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
