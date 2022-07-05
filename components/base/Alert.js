import classNames from "classnames";

export default function Alert({ className, text }) {
    const defaultText = 'No se encontraron resultados...';

    return (
        <div className="text-center my-4">
            <p className={classNames("text-center", className)}>{text || defaultText}</p>
        </div>
    )
}
