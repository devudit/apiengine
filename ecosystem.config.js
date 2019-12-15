module.exports = {
    apps : [{
        name: "API Engine",
        script: "./engine.js",
        watch: true,
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}