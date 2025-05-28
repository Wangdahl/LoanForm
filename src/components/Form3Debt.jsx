import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Form3Debt({ data, updateSection, hydrated }) {
    const navigate = useNavigate();

    // Yup‐schema för validering
    const ObligationsSchema = Yup.object().shape({
        otherLoans: Yup.array().of(
            Yup.object().shape({
                type: Yup.string().required('Välj lånetyp'),
                amount: Yup.number()
                    .typeError('Ange en siffra')
                    .min(1, 'Belopp måste vara minst 1 SEK')
                    .required('Ange belopp')
            })
        ),
        monthlyExpenses: Yup.number()
            .typeError('Ange en siffra')
            .min(0, 'Kan inte vara negativt')
            .required('Ange månadsutgifter')
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: data,
        resolver: yupResolver(ObligationsSchema)
    });

    // Återställer input vid omladdning, endast en gång efter hydration
    const didHydrateRef = useRef(false);
    useEffect(() => {
        if (hydrated && !didHydrateRef.current) {
            reset(data);
            didHydrateRef.current = true;
        }
    }, [hydrated, reset, data]);

    // useFieldArray för dynamiska fält för övriga lån
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'otherLoans'
    });

    // Funktion som hämtar alla fältvärden och sparar i parent + localStorage
    const handleFieldChange = () => {
        const vals = getValues();
        updateSection('obligations', vals);
    };

    // Sparar input­värden och navigerar vidare till nästa form onSubmit
    const onSubmit = (values) => {
        updateSection('obligations', values);
        navigate('/lan');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>Övriga lån och kostnader</h2>
            <fieldset className="form-field">
                <legend>Andra lån</legend>
                {fields.length > 0 ? (
                    <div className="loans-list">
                        {fields.map((field, index) => (
                            <div key={field.id} className="loan-item">
                                <select
                                    defaultValue={field.type}
                                    {...register(`otherLoans.${index}.type`, {
                                        onChange: handleFieldChange
                                    })}
                                >
                                    <option value="">-- Välj lånetyp --</option>
                                    <option value="Bostadslån">Bostadslån</option>
                                    <option value="Billån">Billån</option>
                                    <option value="Blancolån">Blancolån</option>
                                    <option value="Studielån">Studielån</option>
                                </select>
                                <input
                                    type="number"
                                    step="1"
                                    placeholder="Belopp (SEK)"
                                    defaultValue={field.amount}
                                    {...register(`otherLoans.${index}.amount`, {
                                        onChange: handleFieldChange
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        remove(index);
                                        handleFieldChange();
                                    }}
                                >
                                    Ta bort
                                </button>
                                {errors.otherLoans?.[index] && (
                                    <div className="error-group">
                                        {errors.otherLoans[index].type && (
                                            <p className="error">{errors.otherLoans[index].type.message}</p>
                                        )}
                                        {errors.otherLoans[index].amount && (
                                            <p className="error">{errors.otherLoans[index].amount.message}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Inga andra lån tillagda</p>
                )}
                <button
                    type="button"
                    onClick={() => {
                        append({ type: '', amount: '' });
                        handleFieldChange();
                    }}
                >
                    Lägg till lån
                </button>
            </fieldset>

            <div className="form-field">
                <label htmlFor="monthlyExpenses">Månadsutgifter (SEK)</label>
                <input
                    id="monthlyExpenses"
                    type="number"
                    defaultValue={data.monthlyExpenses}
                    {...register('monthlyExpenses', {
                        onChange: handleFieldChange
                    })}
                />
                {errors.monthlyExpenses && (
                    <p className="error">{errors.monthlyExpenses.message}</p>
                )}
            </div>

            <div className="form-navigation">
                <button type="button" onClick={() => navigate('/inkomst')}>
                    Tillbaka
                </button>
                <button type="submit">Nästa</button>
            </div>
        </form>
    );
}
