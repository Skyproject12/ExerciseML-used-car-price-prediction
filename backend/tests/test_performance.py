import time
import numpy as np

from app.predictor import CarPricePredictor


def test_inference_performance():

    predictor = CarPricePredictor()

    payload = {
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

    # Warm-up
    for _ in range(5):
        predictor.predict(payload)

    inference_times = []

    # Benchmark 100 predictions
    for _ in range(100):

        start = time.perf_counter()

        predictor.predict(payload)

        end = time.perf_counter()

        inference_times.append(
            (end - start) * 1000
        )

    print("\n=== INFERENCE PERFORMANCE ===")

    print("Total Predictions:", len(inference_times))
    print(f"Average: {np.mean(inference_times):.2f} ms")
    print(f"Median: {np.median(inference_times):.2f} ms")
    print(f"Minimum: {np.min(inference_times):.2f} ms")
    print(f"Maximum: {np.max(inference_times):.2f} ms")
    print(f"P95: {np.percentile(inference_times, 95):.2f} ms")

    assert len(inference_times) == 100
    assert np.isfinite(inference_times).all()