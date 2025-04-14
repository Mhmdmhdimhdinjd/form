// src/components/template/form.js
import React, { useEffect, useMemo } from 'react';
import { Row, Input, Col, Label, FormGroup, Button, ButtonGroup, InputGroup, FormFeedback } from 'reactstrap';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import fa from './fa';
import dynamic from 'next/dynamic';
import { useTheme } from '@/src/context/themecontext';

const JoditEditor = dynamic(
  () => import('jodit-react'),
  {
    ssr: false,
    loading: () => <p>در حال بارگیری ویرایشگر...</p>,
  }
);

const Form = ({ Controller, control, watch, setValue, clearErrors, errors }) => {
  const { isDark } = useTheme();

  const selectedType = watch('idType');

  const handleTypeChange = (type) => {
    setValue('idType', type);
    setValue('idNumber', '');
  };

  const firstconfig = useMemo(
    () => ({
      language: 'fa',
      i18n: { fa },
      readonly: false,
      theme: isDark ? 'dark' : 'light',
      placeholder: 'رزومه خود را وارد کنید',
      style: { fontFamily: 'gandom' },
    }),
    [isDark]
  );

  const full_time_jobValue = watch('full_time_job');
  const part_time_jobValue = watch('part_time_job');

  useEffect(() => {
    if (full_time_jobValue || part_time_jobValue) {
      clearErrors('checkboxes');
    }
  }, [full_time_jobValue, part_time_jobValue, clearErrors]);

  return (
    <Row className="mb-3" dir="rtl">
      <Col md={6} xs={12}>
        <FormGroup>
          <Label for="first__name">نام</Label>
          <Controller
            control={control}
            name="first__name"
            render={({ field }) => (
              <Input
                {...field}
                id="first__name"
                placeholder="لطفا نام خود را وارد کنید"
                type="text"
                invalid={errors.first__name}
                className={isDark ? 'bg-dark text-white' : ''}
              />
            )}
          />
          <FormFeedback>{errors.first__name?.message}</FormFeedback>
        </FormGroup>
      </Col>

      <Col md={6} xs={12}>
        <FormGroup>
          <Label for="last__name">نام خانوادگی</Label>
          <Controller
            control={control}
            name="last__name"
            render={({ field }) => (
              <Input
                {...field}
                id="last__name"
                placeholder="لطفا نام خانوادگی خود را وارد کنید"
                type="text"
                invalid={errors.last__name}
                className={isDark ? 'bg-dark text-white' : ''}
              />
            )}
          />
          <FormFeedback>{errors.last__name?.message}</FormFeedback>
        </FormGroup>
      </Col>

      <Col md={6} xs={12}>
        <FormGroup>
          <Label>کد پستی</Label>
          <Controller
            control={control}
            name="postal_code"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="کد پستی خود را وارد کنید"
                type="text"
                maxLength={10}
                invalid={errors.postal_code}
                className={isDark ? 'bg-dark text-white' : ''}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
            )}
          />
          <FormFeedback>{errors.postal_code?.message}</FormFeedback>
        </FormGroup>
      </Col>

      <Col md={6} xs={12}>
        <FormGroup>
          <Label>کد ملی یا شناسه اقتصادی</Label>
          <InputGroup dir="ltr">
            <Controller
              control={control}
              name="idNumber"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    selectedType === 'national' ? 'کد ملی (۱۰ رقم)' : 'شناسه اقتصادی (۱۲ رقم)'
                  }
                  type="number"
                  dir="rtl"
                  maxLength={selectedType === 'national' ? 10 : 12}
                  invalid={!!errors.idNumber}
                  className={isDark ? 'bg-dark text-white' : ''}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                />
              )}
            />
            <ButtonGroup>
              <Button
                color="primary"
                outline
                onClick={() => handleTypeChange('national')}
                active={selectedType === 'national'}
                className="rounded-0"
              >
                حقیقی
              </Button>
              <Button
                color="primary"
                outline
                onClick={() => handleTypeChange('economic')}
                active={selectedType === 'economic'}
              >
                حقوقی
              </Button>
            </ButtonGroup>
          </InputGroup>
          {errors.idNumber && <h6 className="mt-1 text-danger">{errors.idNumber.message}</h6>}
        </FormGroup>
      </Col>

      <Col className="mb-3" md={6} xs={12}>
        <Label>نوع همکاری:</Label>
        <br />
        <FormGroup check inline>
          <Label check>تمام وقت</Label>
          <Controller
            control={control}
            name="full_time_job"
            render={({ field }) => (
              <Input
                {...field}
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                innerRef={field.ref}
              />
            )}
          />
        </FormGroup>
        <FormGroup check inline>
          <Controller
            control={control}
            name="part_time_job"
            render={({ field }) => (
              <Input
                {...field}
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                innerRef={field.ref}
              />
            )}
          />
          <Label check>پاره وقت</Label>
        </FormGroup>
        {errors.checkboxes && <p className="mt-1 text-danger">{errors.checkboxes.message}</p>}
      </Col>

      <Col md={6} xs={12}>
        <FormGroup>
          <Label>تاریخ تولد</Label>
          <br />
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                {...field}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                placeholder="تاریخ تولد خود را وارد کنید"
                inputClass={`form-control ${errors.date ? 'is-invalid' : ''} ${isDark ? 'bg-dark text-white' : ''}`}
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
          <h6 className="mt-1 text-danger">{errors.date?.message}</h6>
        </FormGroup>
      </Col>

      <Col xs={12}>
        <FormGroup>
          <Label>رزومه کامل</Label>
          <br />
          <Controller
            control={control}
            name="resume"
            render={({ field }) => (
              <JoditEditor
                {...field}
                config={firstconfig}
                value={field.value}
                tabIndex={1}
                onChange={(newContent) => field.onChange(newContent)}
              />
            )}
          />
          <h6 className="mt-1 text-danger">{errors.resume?.message}</h6>
        </FormGroup>
      </Col>

      <Col>
        <Button color="primary" type="submit">
          ثبت اطلاعات وارد شده
        </Button>
      </Col>
    </Row>
  );
};

export default Form;