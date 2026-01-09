# Use a lightweight Alpine image
FROM alpine:latest

# Install dependencies (ca-certificates for HTTPS)
RUN apk add --no-cache ca-certificates

# Set the working directory
WORKDIR /pb

# Copy the local pocketbase executable and migrations
COPY ./pocketbase /pb/pocketbase
COPY ./pb_migrations /pb/pb_migrations

# Ensure the binary is executable
RUN chmod +x /pb/pocketbase

# Expose the default PocketBase port
EXPOSE 8090

# Start PocketBase with migrations applied automatically
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations"]
