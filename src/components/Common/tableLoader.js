export const tableLoader = ($col) => {
    for (let i;i <= $col;i++){
        return (
            // eslint-disable-next-line react/react-in-jsx-scope
            <td key={i} className="col1">
                {/* eslint-disable-next-line react/react-in-jsx-scope */}
                <span></span>
            </td>
        )
    }
}