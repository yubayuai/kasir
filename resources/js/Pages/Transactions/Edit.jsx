import Form from './Form';

export default function Edit({ transaction, vouchers, insurances, procedures }) {
    return <Form transaction={transaction} vouchers={vouchers} insurances={insurances} procedures={procedures} isEdit={true} />;
}
