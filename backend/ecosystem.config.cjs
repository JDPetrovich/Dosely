module.exports = {
    apps: [
        {
            name: "api",
            script: "dist/main.js",

            autorestart: true,

            max_restarts: 20,
            min_uptime: 7000,

            exp_backoff_restart_delay: 1000,

            max_memory_restart: "300M",

            kill_timeout: 5000,

            time: true,

            error_file: "./logs/api-error.log",
            out_file: "./logs/api-out.log",
            merge_logs: true,

            watch: false,
            ignore_watch: ["node_modules", "logs"]
        }
    ]
};