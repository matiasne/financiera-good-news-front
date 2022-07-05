package com.gsb.goodnews.queryobject.querydsl;

import com.gsb.goodnews.exception.BadRequestException;

public class JPAQueryPageSizeHelper {

    public static long getOffset(int page, int size) {
        if (size > 100) {
            throw new BadRequestException("Size must not be greater than 100");
        }

        if (page < 0) {
            throw new BadRequestException("Page must not be negative");
        }

        int limit = getLimit(size);

        // Calculate offset
        int offset = 0;
        if (page != 0) {
            offset = (page - 1) * limit;
        }

        return offset;
    }

    public static int getLimit(int size) {
        // Set default size to 10
        if (size == 0) {
            size = 10;
        }

        return size;
    }
}
