import React, { useEffect, useState, useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationComponent = ({
                                 // eslint-disable-next-line react/prop-types
    total = 0,
                                 // eslint-disable-next-line react/prop-types
    itemsPerPage = 20,
                                 // eslint-disable-next-line react/prop-types
    currentPage = 1,
                                 // eslint-disable-next-line react/prop-types
    onPageChange
}) => {
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (total > 0 && itemsPerPage > 0)
            setTotalPages(Math.ceil(total / itemsPerPage));
    }, [total, itemsPerPage]);

    const paginationItems = useMemo(() => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        return pages;
    }, [totalPages, currentPage]);

    if (totalPages === 0) return null;

    return (
        <Pagination>
            <Pagination.Prev
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
            {paginationItems}
            <Pagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    );
};

export default PaginationComponent;
