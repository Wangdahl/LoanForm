import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Form4Loan({ data, updateSection }) {
    const navigate = useNavigate();

    // Yup schema för validering
    const RequestSchema = Yup.object().shape({
        amount: Yup.number()
            .typeError('Ange en siffra')
            .min(500, 'Lånebelopp måste vara minst 500 kr')
            .required('Ange lånebelopp'),
        purpose: Yup.string().required('Ange syftet med lånet'),
        termYears: Yup.number()
            .typeError('Ange en siffra')
            .min(1, 'Måste vara minst 1 år')
            .required('Ange återbetalningstid')
    });

    const {register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: data,
        resolver: yupResolver(RequestSchema)
    });

    //Återställer input vid omladdning
    useEffect(() => {
        reset(data);
    }, [data, reset]);

    const isFirst = useRef(true);
    useEffect(() => {
        const storeFormInput = watch((values) => {
            if(isFirst.current) {
                isFirst.current = false;
                return;
            }
            updateSection('request', values);
        });
        return () => storeFormInput.unsubscribe();
    }, [watch, updateSection])

    //Sparar input värden och navigerar vidare till nästa form onSubmit
    const onSubmit = (values) => {
        updateSection('request', values);
        navigate('/granska');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2>Önskat lån</h2>
                <div className='form-field'>
                    <label htmlFor="amount">Önskat belopp (SEK)</label>
                    <input id='amount' {...register('amount')} type='number' />
                    {errors.amount && <p className='error'>{errors.amount.message}</p>}
                </div>
                <div className="form-field">
                    <label htmlFor="purpose">Syfte med lånet</label>
                    <input id="purpose" {...register('purpose')} type="text" />
                    {errors.purpose && <p className="error">{errors.purpose.message}</p>}
                </div>
                <div className="form-field">
                    <label htmlFor="termYears">Återbetalningstid (år)</label>
                    <input id="termYears" {...register('termYears')} type="number" />
                    {errors.termYears && <p className="error">{errors.termYears.message}</p>}
                </div>
                <div className="form-navigation">
                    <button type="button" onClick={() => navigate('/skulder')}>Tillbaka</button>
                    <button type="submit">Nästa</button>
                </div>
            </form>
        </div>
    )
}