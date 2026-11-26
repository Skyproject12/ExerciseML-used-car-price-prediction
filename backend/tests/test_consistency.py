import pytest

from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


test_cases = [
    ("BMW", "Serie 3", "320i Business Edition", 2006, 87500),
    ("Toyota", "Avanza", None, 2015, 75000),
    ("Honda", "Brio", "Satya E", 2018, 35000),
    ("Daihatsu", "Xenia", "Xi", 2012, 95000),
    ("Honda", "Jazz", "RS", 2017, 45000),
]


@pytest.mark.parametrize(
    "merek,model,varian,tahun,jarak_tempuh",
    test_cases
)
def test_prediction_consistency(
    client,
    merek,
    model,
    varian,
    tahun,
    jarak_tempuh
):
    payload = {
        "provinsi": "Jawa Tengah",
        "merek": merek,
        "model": model,
        "varian": varian,
        "tahun": tahun,
        "jarak_tempuh": jarak_tempuh,
        "tipe_bahan_bakar": "Bensin",
        "warna": "Hitam",
        "transmisi": None,
        "tipe_bodi": None,
        "kapasitas_mesin": None,
        "tipe_penjual": "Individu",
        "sistem_penggerak": None
    }

    # Direct model prediction
    direct_prediction = app.state.predictor.predict(
        payload
    )

    # API prediction
    response = client.post(
        "/predict",
        json=payload
    )

    assert response.status_code == 200

    api_prediction = response.json()["predicted_price"]

    difference = abs(
        direct_prediction - api_prediction
    )

    print(f"\nVehicle: {merek} {model}")
    print(f"Direct: Rp {direct_prediction:,.2f}")
    print(f"API: Rp {api_prediction:,.2f}")
    print(f"Difference: {difference:.6f}")

    assert difference <= 1