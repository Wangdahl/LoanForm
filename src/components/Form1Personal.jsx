import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


export default function Form1Personal({data, updateSection}) {
    const navigate = useNavigate()

    //Yup validering för personuppgifter
    const PersonalSchema = Yup.object().shape({
        name: Yup.string().required('Ange namn'),
        personalNumber: Yup.string()
            .required('Ange personnummer')
            .matches(/^\d{12}$/, 'Personnummer måste vara 12 siffror')
            .test(
                'age',
                'Du måste vara 18 år eller äldre',
                (value) => {
                    if (!/^\d{12}$/.test(value)) return false;
                    const yyyy = value.slice(0,4);
                    const mm   = value.slice(4,6);
                    const dd   = value.slice(6,8);
                    const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
                    if (isNaN(birthDate)) return false;
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const mDiff = today.getMonth() - birthDate.getMonth();
                    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age >= 18;
                }
            ),
        phone: Yup.string().required('Ange telefonnummer'),
        email: Yup.string().email('Ogiltig e-postadress').required('Ange e-postadress'),
        address: Yup.string().required('Ange adress')
    });

    const { register, handleSubmit, reset, formState: { errors }} = useForm({
        defaultValues: data,
        resolver: yupResolver(PersonalSchema)
    })

    //Återställer input vid omladdning
    useEffect(() => {
        reset(data);
    }, [data, reset]);


    //Sparar input värden och navigerar vidare till nästa form onSubmit
    const onSubmit = (values) => {
        updateSection('personal', values);
        navigate('/inkomst');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-field">
                <label htmlFor="name">Namn</label>
                <input id="name" {...register('name')} type="text" />
                {errors.name && <p className="error">{errors.name.message}</p>}
            </div>
            <div className="form-field">
                <label htmlFor="personalNumber">Personnummer</label>
                <input id="personalNumber" {...register('personalNumber')} type="text" />
                {errors.personalNumber && <p className="error">{errors.personalNumber.message}</p>}
            </div>
            <div className="form-field">
                <label htmlFor="phone">Telefon</label>
                <input id="phone" {...register('phone')} type="tel" />
                {errors.phone && <p className="error">{errors.phone.message}</p>}
            </div>
            <div className="form-field">
                <label htmlFor="email">E-post</label>
                <input id="email" {...register('email')} type="email" />
                {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
            <div className="form-field">
                <label htmlFor="address">Adress</label>
                <input id="address" {...register('address')} type="text" />
                {errors.address && <p className="error">{errors.address.message}</p>}
            </div>
            <div className="form-navigation">
                <button type="submit">Nästa</button>
            </div>
        </form>
    );
}