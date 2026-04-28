import Form from './Form';

export default function Edit({ voucher }) {
    return <Form isEdit={true} voucher={voucher} />;
}
