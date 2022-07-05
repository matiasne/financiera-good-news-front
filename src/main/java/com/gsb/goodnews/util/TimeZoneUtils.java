package com.gsb.goodnews.util;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

public class TimeZoneUtils {

    private static final DateTimeZone zone = DateTimeZone.forID("America/Buenos_Aires");

    public static DateTime now() {
        return new DateTime(zone);
    }
}
