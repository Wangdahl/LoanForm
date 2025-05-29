import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import '../styles/Forms.css';

export default function Form2Income({ data, updateSection, hydrated }) {
    const navigate = useNavigate();

    // Yup validering för inkomststeg
    const IncomeSchema = Yup.object().shape({
        workStatus: Yup.string().required('Ange sysselsättning'),
        employerName: Yup.string().when('workStatus', {
            is: 'Anställd',
            then: s => s.required('Ange arbetsgivare'),
            otherwise: s => s.notRequired()
        }),
        jobTitle: Yup.string().when('workStatus', {
            is: 'Anställd',
            then: s => s.required('Ange befattning'),
            otherwise: s => s.notRequired()
        }),
        salary: Yup.number()
        .typeError('Ange en siffra')
        .min(0, 'Måste vara 0 eller mer')
        .required('Ange månadslön'),
        message: Yup.string().notRequired()
    });

    const {
        register, handleSubmit, reset, formState: { errors }, watch
    } = useForm({
            defaultValues: data, resolver: yupResolver(IncomeSchema)
        });

    // Reset en gång efter hydration
    const didHydrateRef = useRef(false);
    useEffect(() => {
        if (hydrated && !didHydrateRef.current) {
            reset(data);
            didHydrateRef.current = true;
        }
    }, [hydrated, reset, data]);

     // Live-spara ändringar
    const isFirst = useRef(true);
    useEffect(() => {
        const storeFormInput = watch((values) => {
            if(isFirst.current) {
                isFirst.current = false;
                return;
            }
            const enriched = {
                ...values,
                employed: values.workStatus === 'Anställd'
            };
            updateSection('income', enriched);

        });
        return () => storeFormInput.unsubscribe();
    }, [watch, updateSection])

    // Varning för låg lön
    const salaryValue = watch('salary', data.salary);
    const showLowSalaryWarning = salaryValue < 15000;

    //Sparar input värden och navigerar vidare till nästa form onSubmit
    const onSubmit = values => {
        updateSection('income', {
            ...values,
            employed: values.workStatus === 'Anställd'
        });
        navigate('/skulder');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2>Inkomst</h2>

                <div className="form-field">
                    <label htmlFor="workStatus">Sysselsättning</label>
                    <select
                        id="workStatus"
                        {...register('workStatus')}
                        defaultValue={data.workStatus}
                    >
                        <option value="">-- Välj sysselsättning --</option>
                        <option value="Anställd">Anställd</option>
                        <option value="Egenföretagare">Egenföretagare</option>
                        <option value="Student">Student</option>
                        <option value="Arbetslös">Arbetslös</option>
                        <option value="Pensionär">Pensionär</option>
                    </select>
                    {errors.workStatus && (
                        <p className="error">{errors.workStatus.message}</p>
                    )}
                </div>

                {/* Visas bara om anställd */}
                {watch('workStatus') === 'Anställd' && (
                <>
                    <div className="form-field">
                        <label htmlFor="employerName">Arbetsgivare</label>
                        <input
                            id="employerName"
                            type="text"
                            {...register('employerName')}
                            defaultValue={data.employerName}
                        />
                        {errors.employerName && (
                            <p className="error">{errors.employerName.message}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="jobTitle">Befattning</label>
                        <input
                            id="jobTitle"
                            type="text"
                            {...register('jobTitle')}
                            defaultValue={data.jobTitle}
                        />
                        {errors.jobTitle && (
                            <p className="error">{errors.jobTitle.message}</p>
                        )}
                    </div>
                </>
                )}

                <div className="form-field">
                    <label htmlFor="salary">Månadslön (SEK)</label>
                    <input
                        id="salary"
                        type="number"
                        {...register('salary')}
                        defaultValue={data.salary}
                    />
                    {errors.salary && <p className="error">{errors.salary.message}</p>}
                    {showLowSalaryWarning && (
                        <p className="warning">Din lön är för låg för kreditvärdighet.</p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="message">Meddelande (valfritt)</label>
                    <textarea
                        id="message"
                        rows="3"
                        {...register('message')}
                        defaultValue={data.message}
                    ></textarea>
                    {errors.message && (
                        <p className="error">{errors.message.message}</p>
                    )}
                </div>

                <div className="form-navigation">
                    <button type="button" onClick={() => navigate('/personligt')}>
                        Tillbaka
                    </button>
                    <button type="submit">Nästa</button>
                </div>
            </form>
        </div>
    );
}