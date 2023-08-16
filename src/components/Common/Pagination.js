import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from 'components/Common/usePagination';
import 'assets/scss/pagination.scss';
const Pagination = props => {
    const {
        // eslint-disable-next-line react/prop-types
        onPageChange,
        // eslint-disable-next-line react/prop-types
        totalCount,
        // eslint-disable-next-line react/prop-types
        siblingCount = 1,
        // eslint-disable-next-line react/prop-types
        currentPage,
        // eslint-disable-next-line react/prop-types
        pageSize,
        // eslint-disable-next-line react/prop-types
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <ul
            className={classnames('pagination-container', { [className]: className })}
        >
            <li
                className={classnames('pagination-item', {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>
            {paginationRange.map((pageNumber,key) => {
                if (pageNumber === DOTS) {
                    return <li key={key} className="pagination-item dots">&#8230;</li>;
                }

                return (
                    // eslint-disable-next-line react/jsx-key
                    <li key={key}
                        className={classnames('pagination-item', {
                            selected: pageNumber === currentPage
                        })}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                className={classnames('pagination-item', {
                    disabled: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
};

export default Pagination;
