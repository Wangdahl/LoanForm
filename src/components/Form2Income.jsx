import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import '../styles/Forms.css';

export default function Form2Income({ data, updateSection }) {
    const navigate = useNavigate();

    // Yup validering för inkomststeg
    const IncomeSchema = Yup.object({
        employed: Yup.boolean(),
        workStatus: Yup.string().required('Ange sysselsättning'),
        // Vid anställning: arbetsgivare krävs
        employerName: Yup.string().when('employed', (employed, schema) =>
        employed ? schema.required('Ange arbetsgivare') : schema
        ),
        // Vid anställning: befattning krävs
        jobTitle: Yup.string().when('employed', (employed, schema) =>
        employed ? schema.required('Ange befattning') : schema
        ),
        salary: Yup.number()
            .typeError('Ange en siffra')
            .min(0, 'Måste vara 0 eller mer')
            .required('Ange månadslön'),
        message: Yup.string()
    });

    const {
        register, handleSubmit, setValue, reset, formState: { errors }, watch
    } = useForm({
            defaultValues: data, resolver: yupResolver(IncomeSchema)
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
            updateSection('income', values);
        });
        return () => storeFormInput.unsubscribe();
    }, [watch, updateSection])

    // När workstatus ändras, flippa `employed` bool
    const workStatus = watch('workStatus');
    useEffect(() => {
        setValue('employed', workStatus === 'Anställd', {
            shouldValidate: true,
            shouldDirty: true
        });
    }, [workStatus, setValue]);

    // Varning för låg lön
    const salaryValue = watch('salary', data.salary);
    const showLowSalaryWarning = salaryValue < 15000;

    //Sparar input värden och navigerar vidare till nästa form onSubmit
    const onSubmit = (values) => {
        updateSection('income', values);
        navigate('/skulder');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2>Inkomst</h2>
                <div className="form-field">
                    <label htmlFor="workStatus">Sysselsättning</label>
                    <select id="workStatus" {...register('workStatus')} defaultValue={data.workStatus}>
                        <option value="">-- Välj sysselsättning --</option>
                        <option value="Anställd">Anställd</option>
                        <option value="Egenföretagare">Egenföretagare</option>
                        <option value="Student">Student</option>
                        <option value="Arbetslös">Arbetslös</option>
                        <option value="Pensionär">Pensionär</option>
                    </select>
                    {errors.workStatus && <p className="error">{errors.workStatus.message}</p>}
                </div>
                <input type="hidden" {...register('employed')} />

                {watch('employed') && (
                    <>
                    <div className="form-field">
                        <label htmlFor="employerName">Arbetsgivare</label>
                        <input
                            id="employerName"
                            type="text"
                            {...register('employerName')}
                        />
                        {errors.employerName && <p className="error">{errors.employerName.message}</p>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="jobTitle">Befattning</label>
                        <input
                            id="jobTitle"
                            type="text"
                            {...register('jobTitle')}
                        />
                            {errors.jobTitle && <p className="error">{errors.jobTitle.message}</p>}
                    </div>
                    </>
                )}

                <div className="form-field">
                    <label htmlFor="salary">Månadslön (SEK)</label>
                    <input id="salary" type="number" {...register('salary')} />
                    {errors.salary && <p className="error">{errors.salary.message}</p>}
                </div>
                    {showLowSalaryWarning && <p className="warning">Din lön är för låg för kreditvärdighet.</p>}

                <div className="form-field">
                    <label htmlFor="message">Meddelande (valfritt)</label>
                    <textarea
                        id="message"
                        rows="3"
                        {...register('message')}
                    ></textarea>
                        {errors.message && <p className="error">{errors.message.message}</p>}
                </div>

                <div className="form-navigation">
                    <button type="button" onClick={() => navigate('/personligt')}>Tillbaka</button>
                    <button type="submit">Nästa</button>
                </div>
            </form>
        </div>
    );
}