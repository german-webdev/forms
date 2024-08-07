import React, { useEffect, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

type FormValues = {
  phone: string;
  firstName: string;
  lastName: string;
  gender: string;
};

const PersonalDataForm: React.FC = () => {
  const { control, handleSubmit, reset, formState, setValue } = useForm<FormValues>({
    defaultValues: {
      phone: '',
      firstName: '',
      lastName: '',
      gender: '',
    },
  });
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const loadSavedData = useCallback(() => {
    const savedData = JSON.parse(localStorage.getItem('personalData') || '{}');
    if (savedData) {
      reset(savedData);
      setPhone(savedData.phone || '');
    }
  }, [reset]);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return `+7 ${match[2] ? `(${match[2]})` : ''} ${match[3]}${match[4] ? ` ${match[4]}` : ''}`;
    }
    return value;
  };

  const isPhoneNumberComplete = (value: string): boolean => {
    return /^\+7 \(\d{3}\) \d{3} \d{4}$/.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);

    if (!isPhoneNumberComplete(formattedValue) || value.length <= formattedValue.length) {
      setPhone(formattedValue);
      setValue('phone', formattedValue, { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormValues) => {
    localStorage.setItem('personalData', JSON.stringify(data));
    navigate('/address-work');
  };

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-light">
            <Form.Group controlId="phone">
              <Form.Label>Телефон</Form.Label>
              <Controller
                name="phone"
                control={control}
                rules={{ 
                  required: 'Телефон обязателен',
                  pattern: {
                    value: /^\+7 \(\d{3}\) \d{3} \d{4}$/,
                    message: 'Телефон должен быть в формате +7 (999) 999 9999'
                  }
                }}
                render={({ field }) => (
                  <>
                    <Form.Control
                      type="tel"
                      {...field}
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+7 (999) 999 9999"
                      isInvalid={!!formState.errors.phone}
                      maxLength={17}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.phone?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Form.Group controlId="firstName" className="mt-3">
              <Form.Label>Имя</Form.Label>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'Имя обязательно' }}
                render={({ field }) => (
                  <>
                    <Form.Control
                      type="text"
                      {...field}
                      isInvalid={!!formState.errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.firstName?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Form.Group controlId="lastName" className="mt-3">
              <Form.Label>Фамилия</Form.Label>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Фамилия обязательна' }}
                render={({ field }) => (
                  <>
                    <Form.Control
                      type="text"
                      {...field}
                      isInvalid={!!formState.errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.lastName?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Form.Group controlId="gender" className="mt-3">
              <Form.Label>Пол</Form.Label>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'Пол обязателен' }}
                render={({ field }) => (
                  <>
                    <Form.Select {...field} isInvalid={!!formState.errors.gender}>
                      <option value="">Выберите пол</option>
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.gender?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <div className="mt-4">
              <Button variant="primary" type="submit">
                Далее
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalDataForm;
