import React, { useState } from 'react';
import { Button, Input, Select, InputNumber, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStateValue } from '../../state';
import { addQuestion, setQuestionsAttributes } from '../../state/actions';

import { storage } from '../../constants/firebase';

const { Option } = Select;
const POINTS = [100, 200, 300, 400, 500];

const FormQuestions = ({ form, ...props }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const { state, dispatch } = useStateValue();
  const { allCategories, editing } = state.questions;
  const { name, errorPoints, errorName, errorCategories } = state.questionToAdd;

  const handlePointsChange = value => {
    form.setFieldsValue({ points: value });
    dispatch(
      addQuestion({ points: value, errorPoints: !POINTS.includes(value) })
    );
  };

  const handleSelect = value => {
    form.setFieldsValue({ categories: value });
    dispatch(addQuestion({ categories: value, errorCategories: value === 0 }));
  };

  const handleNameChange = e => {
    const name = e.target.value;
    if (editing) dispatch(setQuestionsAttributes({ nameChanged: true }));
    dispatch(addQuestion({ name, errorName: name.length < 4 }));
  };

  // https://www.youtube.com/watch?v=mEf-6IUsTKs
  let imageToUpload = null;
  const [progress, setProgress] = useState(0);

  const handleImage = () => {
    if (imageToUpload == null) return;
    // console.log(imageToUpload);
    uploadFiles(imageToUpload);
  };

  const uploadFiles = file => {
    const filename = 'image' + new Date().getTime();
    const uploadTask = storage.ref('imagenes/' + filename).put(file);
    uploadTask.on(
      'state_changed',
      snapshot => {

        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setProgress(prog);

      },
      error => console.log(error),
      () => {
        storage
          .ref('imagenes')
          .child(filename)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            dispatch(addQuestion({ image: url }));
            imageToUpload = null;
            setProgress(0);
          })
          .catch(error => {
            /* TODO: la logica de manejar el error se puede mover a su propio archivo 
              util.js en esta misma carpeta o dentro de la carpeta src/helpers
              y crear un archivo util o index.js para exportar la funcion desde ahi */
            let errorImage = false;
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/object-not-found':
                // File doesn't exist
                errorImage = true;
                // errorMsg = '....'
                break;
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                errorImage = true;
                // errorMsg = '....'
                break;
              case 'storage/canceled':
                // User canceled the upload
                errorImage = true;
                break;
              case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                errorImage = true;
                break;
              default:
                errorImage = false;
                break;
            }
            console.log('Error uploading the image', error);
            // TODO: mostrar en el UI que hubo un error dependendiendo del tipo de error
            dispatch(addQuestion({ errorImage }));
          });
      }
    );
  };

  return (
    <Form
      form={form}
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      {errorName && <p className="red">Favor introducir mínimo 4 caracteres</p>}
      <Form.Item label="Nueva Pregunta:">
        <Input value={name} onChange={handleNameChange} />
      </Form.Item>

      {errorCategories && (
        <p className="red">Favor de seleccionar al menos una categoría</p>
      )}
      <Form.Item label="Categorías:" name="categories">
        <Select mode="multiple" onChange={handleSelect}>
          {allCategories.map(({ name }) => (
            <Option value={name} key={name}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {errorPoints && (
        <p className="red">
          Favor introducir un valor de 100, 200, 300, 400, 500
        </p>
      )}
      <Form.Item label="Valor en puntos: " name="points">
        <InputNumber
          min={POINTS[0]}
          max={POINTS[4]}
          step={POINTS[0]}
          defaultValue={POINTS[0]}
          onChange={handlePointsChange}
        />
      </Form.Item>

      <Form.Item label="Imágenes:" name="imageURL">
        <Input
          type="file"
          onChange={event => {
            imageToUpload = event.target.files[0];
          }}
        />

        <Button type="primary" onClick={handleImage}>
          Subir imágen - {progress}%
        </Button>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: isDesktop ? 4 : 0 }}>
        <Button type="primary" htmlType="submit" onClick={props.onSubmit}>
          {editing ? 'Actualizar' : 'Agregar'}
        </Button>
        {editing && (
          <Button
            type="danger"
            onClick={props.cancelUpdate}
            className="cancel-btn-form">
            Cancelar
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default FormQuestions;
