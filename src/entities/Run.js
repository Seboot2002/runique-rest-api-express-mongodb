class RunModel {

    constructor({
        id,
        durationMillis, 
        distanceMeters, 
        epochMillis, 
        lat, 
        long, 
        avgSpeedKmh, 
        maxSpeedKmh, 
        totalElevationMeters
    }) {

        this.id = id;
        this.durationMillis = durationMillis;
        this.distanceMeters = distanceMeters;
        this.epochMillis = epochMillis;
        this.lat = lat;
        this.long = long;
        this.avgSpeedKmh = avgSpeedKmh;
        this.maxSpeedKmh = maxSpeedKmh;
        this.totalElevationMeters = totalElevationMeters;
    }
}

module.exports = RunModel;