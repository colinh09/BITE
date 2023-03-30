def extract_lat_lon(file_name):
    lat_lon_list = []

    with open(file_name, 'r') as file:
        for line in file:
            data = line.strip().split(',')

            if data[2] == "NY":
                lat = data[5]
                lon = data[6]
                lat_lon_list.append((lat, lon))

    return lat_lon_list


def write_output(file_name, lat_lon_list):
    with open(file_name, 'w') as file:
        for lat, lon in lat_lon_list:
            file.write(f"{lat},{lon}\n")


def main():
    input_file = "input_data.txt"
    output_file = "output_lat_lon.txt"

    lat_lon_list = extract_lat_lon(input_file)
    write_output(output_file, lat_lon_list)


if __name__ == "__main__":
    main()
