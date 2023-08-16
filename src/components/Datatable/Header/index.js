import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
const Header = ({ headers, onSorting }) => {
    const [sortingField, setSortingField] = useState("");
    const [sortingOrder, setSortingOrder] = useState("asc");

    const onSortingChange = (field) => {
        const order =
            field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

        setSortingField(field);
        setSortingOrder(order);
        onSorting(field, order);
    };

    return (
        <thead>
            <tr>
                {/* eslint-disable-next-line react/prop-types */}
                {headers.map(({ name, field, sortable }) => (
                    <th
                        key={name}
                        onClick={() =>
                            sortable ? onSortingChange(field) : null
                        }
                    >
                        {name}

                        {sortingField && sortingField === field && (
                            <i
                                className={
                                    sortingOrder === "asc"
                                        ? "arrow-down"
                                        : "arrow-up"
                                }
                            />
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default Header;
