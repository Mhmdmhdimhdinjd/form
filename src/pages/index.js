// pages/index.js
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '@/src/redux/reducer/dataslice';
import Form from '@/src/components/template/form';
import TableComp from '@/src/components/template/TableComp';
import useCreateUser from '@/src/hooks/useCreateUser';
import useGetAllUsers from '@/src/hooks/useGetAllUsers';
import { useTheme } from '@/src/context/themecontext';
import { Button } from 'reactstrap';

const validationSchema = yup.object().shape({
  first__name: yup
    .string()
    .required('نام اجباری است')
    .matches(/^[\u0600-\u06FF\s]+$/, 'نام باید تنها شامل حروف فارسی باشد'),
  last__name: yup
    .string()
    .required('نام خانوادگی اجباری است')
    .matches(/^[\u0600-\u06FF\s]+$/, 'نام خانوادگی باید تنها شامل حروف فارسی باشد'),
  postal_code: yup
    .string()
    .required('کد پستی اجباری است')
    .matches(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
  resume: yup.string().required('رزومه اجباری است'),
  date: yup.string().required('تاریخ اجباری است'),
  idType: yup.string().oneOf(['national', 'economic']).required(),
  idNumber: yup
    .string()
    .when('idType', {
      is: 'national',
      then: (schema) =>
        schema.required('کد ملی الزامی است').matches(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
    })
    .when('idType', {
      is: 'economic',
      then: (schema) =>
        schema
          .required('شناسه اقتصادی الزامی است')
          .matches(/^\d{12}$/, 'شناسه اقتصادی باید ۱۲ رقم باشد'),
    }),
  full_time_job: yup.boolean(),
  part_time_job: yup.boolean(),
  checkboxes: yup.mixed().test(
    'atLeastOne',
    'حداقل یکی از موارد باید انتخاب شود',
    function (value) {
      const { part_time_job, full_time_job } = this.parent;
      return part_time_job || full_time_job;
    }
  ),
});

export default function Home() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const { isDark, toggleTheme } = useTheme();

  const { data: fetchedData, isLoading: isFetching, isError: isFetchError, error: fetchError } =
    useGetAllUsers();

  useEffect(() => {
    if (fetchedData) {
      dispatch(setData(fetchedData));
    }
  }, [fetchedData, dispatch]);

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first__name: '',
      last__name: '',
      postal_code: '',
      full_time_job: false,
      part_time_job: false,
      resume: '',
      date: undefined,
      idType: 'national',
      idNumber: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const { mutate, isLoading: isCreating, isError: isCreateError, error: createError } = useCreateUser();

  const onSubmit = (formData) => {
    mutate(formData, {
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
      },
    });
  };

  return (
    <div className="container-lg" data-bs-theme={isDark ? 'dark' : 'light'}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className={isDark ? 'text-white' : ''}>فرم ثبت اطلاعات</h1>
        <Button color="secondary" onClick={toggleTheme}>
          تغییر تم به {isDark ? 'روشن' : 'تیره'}
        </Button>
      </div>
      <div className="w-100">
        <div className={`p-3 shadow rounded ${isDark ? 'bg-dark' : 'bg-white'}`}>
          {isFetching && <p className={isDark ? 'text-white' : ''}>در حال بارگذاری داده‌ها...</p>}
          {isFetchError && (
            <p style={{ color: 'red' }} className={isDark ? 'text-white' : ''}>
              خطا در بارگذاری: {fetchError.message}
            </p>
          )}
          {isCreating && <p className={isDark ? 'text-white' : ''}>در حال ثبت...</p>}
          {isCreateError && (
            <p style={{ color: 'red' }} className={isDark ? 'text-white' : ''}>
              خطا در ثبت: {createError.message}
            </p>
          )}
          <form className={isDark ? 'text-white' : ''} onSubmit={handleSubmit(onSubmit)}>
            <Form
              Controller={Controller}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              clearErrors={clearErrors}
            />
          </form>
          <TableComp data={data} />
        </div>
      </div>
    </div>
  );
}