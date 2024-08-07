import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';

type FormValues = {
  loanAmount: number;
  loanTerm: number;
};

const LoanParametersForm: React.FC = () => {
  const getInitialValues = useCallback((): FormValues => {
    const savedData = JSON.parse(localStorage.getItem('loanParameters') || '{}');
    return {
      loanAmount: savedData?.loanAmount ?? 200,
      loanTerm: savedData?.loanTerm ?? 10,
    };
  }, []);

  const [initialValues, setInitialValues] = useState<FormValues>(getInitialValues);
  const { control, handleSubmit, reset, formState, setValue, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('loanParameters') || '{}');
    if (savedData && savedData.loanAmount !== undefined && savedData.loanTerm !== undefined) {
      setInitialValues(savedData);
      reset(savedData);
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem('loanParameters', JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: FormValues) => {
    const personalData = JSON.parse(localStorage.getItem('personalData') || '{}');
    try {
      await axios.post('https://dummyjson.com/products/add', {
        title: `${personalData.firstName} ${personalData.lastName}`,
      });

      setModalMessage(
        `Поздравляем, ${personalData.lastName} ${personalData.firstName}. Вам одобрено ${data.loanAmount}₽ на ${data.loanTerm} дней.`
      );
      setShowModal(true);

      localStorage.setItem('loanParameters', JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка при отправке заявки', error);
    }
  };

  const loanAmount = watch('loanAmount');
  const loanTerm = watch('loanTerm');

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-light">
            <Form.Group controlId="loanAmount">
              <Form.Label>Сумма займа: {loanAmount || initialValues.loanAmount}₽</Form.Label>
              <Controller
                name="loanAmount"
                control={control}
                rules={{ required: 'Сумма займа обязательна' }}
                render={({ field }) => (
                  <div className='d-flex align-items-center'>
                    <Form.Range
                      {...field}
                      min={200}
                      max={1000}
                      step={100}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(value);
                        setValue('loanAmount', value);
                      }}
                      value={field.value}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.loanAmount?.message}
                    </Form.Control.Feedback>
                  </div>
                )}
              />
            </Form.Group>

            <Form.Group controlId="loanTerm" className="mt-3">
              <Form.Label>Срок займа: {loanTerm || initialValues.loanTerm} дней</Form.Label>
              <Controller
                name="loanTerm"
                control={control}
                rules={{ required: 'Срок займа обязателен' }}
                render={({ field }) => (
                  <div className='d-flex align-items-center'>
                    <Form.Range
                      {...field}
                      min={10}
                      max={30}
                      step={1}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(value);
                        setValue('loanTerm', value);
                      }}
                      value={field.value}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.loanTerm?.message}
                    </Form.Control.Feedback>
                  </div>
                )}
              />
            </Form.Group>

            <div className="mt-4">
              <Button variant="secondary" onClick={() => navigate('/address-work')} className="me-2">
                Назад
              </Button>
              <Button variant="primary" type="submit">
                Подать заявку
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Заявка отправлена</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoanParametersForm;
