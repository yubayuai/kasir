import Form from './Form';

export default function Create({ vouchers, insurances, procedures }) {
    return <Form vouchers={vouchers} insurances={insurances} procedures={procedures} isEdit={false} />;
}
