class RunModel {

    constructor({
        id,
        dateTimeUtc, 
        durationMillis, 
        distanceMeters, 
        lat, 
        long, 
        avgSpeedKmh, 
        maxSpeedKmh, 
        totalElevationMeters
    }) {

        this.id = id;
        this.dateTimeUtc = dateTimeUtc;
        this.durationMillis = durationMillis;
        this.distanceMeters = distanceMeters;
        this.lat = lat;
        this.long = long;
        this.avgSpeedKmh = avgSpeedKmh;
        this.maxSpeedKmh = maxSpeedKmh;
        this.totalElevationMeters = totalElevationMeters;
    }
}

module.exports = RunModel;