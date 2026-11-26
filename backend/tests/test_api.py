import pytest

from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def vehicle_payload():
    return {
        "provinsi": "Jawa Tengah",
        "merek": "BMW",
        "model": "Serie 3",
        "varian": "320i Business Edition",
        "tahun": 2006,
        "jarak_tempuh": 87500,
        "tipe_bahan_bakar": "Bensin",
        "warna": "Hitam",
        "transmisi": "Automatic",
        "tipe_bodi": "Sedan",
        "kapasitas_mesin": ">1.500 - 2.000 cc",
        "tipe_penjual": "Individu",
        "sistem_penggerak": None
    }


def test_health(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["model_loaded"] is True


def test_model_info(client):
    response = client.get("/model/info")

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_model_metrics(client):
    response = client.get("/model/metrics")

    assert response.status_code == 200

    metrics = response.json()

    assert "mae" in metrics
    assert "rmse" in metrics
    assert "mape" in metrics
    assert "r2" in metrics


def test_feature_options(client):
    response = client.get("/features")

    assert response.status_code == 200

    features = response.json()

    assert "provinsi" in features
    assert "merek" in features
    assert "transmisi" in features


def test_vehicle_mapping(client):
    response = client.get("/vehicles")

    assert response.status_code == 200

    vehicles = response.json()

    assert "BMW" in vehicles
    assert "Serie 3" in vehicles["BMW"]


def test_valid_prediction(client, vehicle_payload):
    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 200

    result = response.json()

    assert result["status"] == "success"
    assert result["predicted_price"] > 0
    assert result["currency"] == "IDR"


def test_prediction_consistency(client, vehicle_payload):
    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 200

    predicted_price = response.json()["predicted_price"]

    expected_price = 143234139

    assert abs(predicted_price - expected_price) <= 1


def test_invalid_mileage(client, vehicle_payload):
    vehicle_payload["jarak_tempuh"] = -1000

    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 422


def test_invalid_year(client, vehicle_payload):
    vehicle_payload["tahun"] = 3000

    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 422


def test_missing_required_field(client, vehicle_payload):
    del vehicle_payload["merek"]

    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 422


def test_optional_fields(client, vehicle_payload):
    vehicle_payload["varian"] = None
    vehicle_payload["warna"] = None
    vehicle_payload["sistem_penggerak"] = None

    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 200
    assert response.json()["predicted_price"] > 0


def test_unknown_field(client, vehicle_payload):
    vehicle_payload["unknown_field"] = "test"

    response = client.post(
        "/predict",
        json=vehicle_payload
    )

    assert response.status_code == 422