class RunModel {

    constructor({
        id,
        durationMillis, 
        distanceMeters, 
        lat, 
        long, 
        avgSpeedKmh, 
        maxSpeedKmh, 
        totalElevationMeters,
        epochMillis
    }) {

        this.id = id;
        this.durationMillis = durationMillis;
        this.distanceMeters = distanceMeters;
        this.lat = lat;
        this.long = long;
        this.avgSpeedKmh = avgSpeedKmh;
        this.maxSpeedKmh = maxSpeedKmh;
        this.totalElevationMeters = totalElevationMeters;
        this.epochMillis = epochMillis;
    }
}

module.exports = RunModel;