package internals

import (
	"database/sql"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func Conndb() (*sql.DB, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	cstring := os.Getenv("POSTGRES_CSTRING")
	db, err := sql.Open("pgx", cstring)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}
