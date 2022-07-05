package com.gsb.goodnews.command.transaction.deposit;

import java.math.BigDecimal;

public class TotalHelper {

    public static BigDecimal getTotalForProvider(BigDecimal total, BigDecimal providerAccountFee) {
        return getTotalWithoutFee(total, providerAccountFee);
    }

    public static BigDecimal getTotalForCustomer(BigDecimal total, BigDecimal customerFee) {
        return getTotalWithoutFee(total, customerFee);
    }

    private static BigDecimal getTotalWithoutFee(BigDecimal total, BigDecimal fee) {
        BigDecimal multiplier = BigDecimal.valueOf(100).subtract(fee == null ? BigDecimal.ZERO : fee);
        BigDecimal divisor = BigDecimal.valueOf(100);
        return total.multiply(multiplier).divide(divisor);
    }
}
