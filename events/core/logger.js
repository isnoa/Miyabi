const winston = require("winston");
const wistonDaily = require("winston-daily-rotate-file");
const process = require("process");

const { combine, timestamp, label, printf } = winston.format;

//* 로그 파일 저장 경로 → 루트 경로/logs 폴더
const logDir = `${process.cwd()}/logs`;

//* log 출력 포맷 정의 함수
const logFormat = printf(({ level, message, label, timestamp }) => {
   return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    label({ label: "MIYABI" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat,
  ),
  transports: [
    // 로그를 어떤 식으로 기록할 것인지
    // info 레벨의 로그를 저장할 파일 설정
    new wistonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 1,
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new wistonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.error.log`,
      maxFiles: 1,
      zippedArchive: true,
    }),
  ],
  exceptionHandlers: [
    //uncaughtException 발생시
    new wistonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 1,
      zippedArchive: true,
    }),
  ],
});

// production 환경이 아닌 경우 (개발 단계 등)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
     new winston.transports.Console({
        format: winston.format.combine(
           winston.format.colorize(), // log level별로 색상 적용하기
           winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
        ),
     }),
  );
}

module.exports = logger;