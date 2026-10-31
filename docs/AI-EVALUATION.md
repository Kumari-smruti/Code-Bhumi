# AI evaluation

This repository does not claim benchmark results that have not been measured. The evaluation should be run against a declared Ollama version, exact model tag and digest, operating system, CPU/GPU, RAM, quantization, and context settings.

Create a dataset of at least 100 problems spanning arrays, strings, sorting, searching, trees, graphs, dynamic programming, mathematics, and data structures. For each case, record the problem statement, language, user-code fixture, requested task, expected rubric points, model tag, digest, latency, schema validity, and whether the output incorrectly claims execution.

Score hint relevance, explanation correctness, code-review accuracy, hallucination rate, test-case coverage, structured-output validity, latency, and reliability. Report raw counts and failure examples. Do not convert generated test cases into verified results unless an independent sandbox actually executes them.
