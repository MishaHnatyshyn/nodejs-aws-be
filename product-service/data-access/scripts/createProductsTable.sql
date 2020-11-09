create table products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text not null,
    description text,
    image_url text,
    price integer
)
