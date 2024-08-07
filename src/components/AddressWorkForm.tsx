import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Container, Col } from 'react-bootstrap';
import axios from 'axios';

type FormValues = {
  workplace: string;
  address: string;
};

type Workplace = {
  slug: string;
  name: string;
  url: string;
};

const AddressWorkForm: React.FC = () => {
  const { control, handleSubmit, setValue, formState, watch } = useForm<FormValues>({
    defaultValues: {
      workplace: '',
      address: '',
    },
  });
  const navigate = useNavigate();
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [defaultWorkplace, setDefaultWorkplace] = useState<string>('');

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await axios.get<Workplace[]>('https://dummyjson.com/products/categories');
        setWorkplaces(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке мест работы', error);
      }
    };
    fetchWorkplaces();
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('addressWorkData');
    if (storedData) {
      const data: FormValues = JSON.parse(storedData);
      setDefaultWorkplace(data.workplace);
      setValue('workplace', data.workplace);
      setValue('address', data.address);
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem('addressWorkData', JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: FormValues) => {
    localStorage.setItem('addressWorkData', JSON.stringify(data));
    navigate('/loan-parameters');
  };

  const renderWorkplaceOptions = useMemo(() => {
    return workplaces.map((workplace) => (
      <option key={workplace.slug} value={workplace.name}>
        {workplace.name}
      </option>
    ));
  }, [workplaces]);

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-light">
            <Form.Group controlId="workplace">
              <Form.Label>Место работы</Form.Label>
              <Controller
                name="workplace"
                control={control}
                rules={{ required: 'Место работы обязательно' }}
                render={({ field }) => (
                  <>
                    <Form.Select {...field} isInvalid={!!formState.errors.workplace}>
                      <option value="" disabled={!!defaultWorkplace}>
                        {defaultWorkplace ? field.value : 'Выберите место работы'}
                      </option>
                      {renderWorkplaceOptions}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.workplace?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Form.Group controlId="address" className="mt-3">
              <Form.Label>Адрес проживания</Form.Label>
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Адрес обязателен' }}
                render={({ field }) => (
                  <>
                    <Form.Control type="text" {...field} isInvalid={!!formState.errors.address} />
                    <Form.Control.Feedback type="invalid">
                      {formState.errors.address?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <div className="mt-4">
              <Button variant="secondary" onClick={() => navigate('/')} className="me-2">
                Назад
              </Button>
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

export default AddressWorkForm;
