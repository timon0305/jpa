REM Delete temporary directories
call rd /s /q dist
REM Generate dist directory
call mkdir dist

REM Generate Java Client
call swagger-codegen generate -i index.yaml -l java -o dist/java -c config.json --library feign

call swagger-codegen generate -i index.yaml -l html2 -o dist/documentation

REM Install to local maven repository
call cd dist/java
call mvn install -DskipTests
