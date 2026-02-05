let studyTopics = {
    "foundations": {
        "name": "Foundations",
        "icon": "🏗️",
        "topics": [
            {
                "id": "math",
                "name": "Mathematics & Theory",
                "description": "Math fundamentals required for deep learning, optimization, and scaling intuition.",
                "time": "2 weeks",
                "difficulty": "Intermediate",
                "content": {
                    "keyPoints": [
                        {
                            "title": "📐 Mathematics Fundamentals",
                            "content": "<h4>Linear Algebra</h4>\n<ul>\n    <li>Vectors, matrices, eigenvalues, eigenvectors</li>\n    <li>SVD (Singular Value Decomposition) - critical for LoRA</li>\n    <li>Matrix multiplication and computational complexity</li>\n    <li>Low-rank approximations</li>\n</ul>\n<h4>Calculus & Optimization</h4>\n<ul>\n    <li>Gradients and backpropagation through time (BPTT)</li>\n    <li>Gradient flow analysis</li>\n    <li>Optimizers: AdamW, Lion, Schedule-Free</li>\n    <li>Learning rate schedules (cosine, warmup-stable-decay)</li>\n    <li>Gradient clipping (global norm vs value)</li>\n</ul>\n<h4>Probability & Statistics</h4>\n<ul>\n    <li>Entropy, KL-Divergence, Cross-Entropy Loss</li>\n    <li>Perplexity as an evaluation metric</li>\n    <li>Maximum Likelihood Estimation (MLE)</li>\n    <li>Bayesian inference fundamentals</li>\n</ul>"
                        },
                        {
                            "title": "📚 Essential Resources",
                            "content": "<a href=\"https://www.deeplearningbook.org/\" class=\"resource-link\" target=\"_blank\">📖 Deep Learning Book (Goodfellow et al.)</a>\n<a href=\"https://web.stanford.edu/~boyd/cvxbook/\" class=\"resource-link\" target=\"_blank\">📖 Convex Optimization (Boyd & Vandenberghe)</a>\n<a href=\"https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi\" class=\"resource-link\" target=\"_blank\">🎥 3Blue1Brown - Linear Algebra</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "dl-basics",
                "name": "Deep Learning Basics",
                "description": "Core neural architectures, training techniques, and GPU basics.",
                "time": "2 weeks",
                "difficulty": "Intermediate",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🧠 Core Deep Learning",
                            "content": "<h4>Neural Network Architectures</h4>\n<ul>\n    <li>Feedforward networks and backpropagation</li>\n    <li>CNNs - Convolutional layers, pooling, feature extraction</li>\n    <li>RNNs, LSTMs, GRUs - Sequential modeling</li>\n    <li>Residual connections and skip connections</li>\n</ul>\n<h4>Training Techniques</h4>\n<ul>\n    <li>Batch normalization, Layer normalization, RMSNorm</li>\n    <li>Dropout and regularization methods</li>\n    <li>Mixed precision training (FP16, BF16)</li>\n    <li>Gradient accumulation for large batch training</li>\n</ul>\n<h4>GPU Architecture Basics</h4>\n<ul>\n    <li>CUDA cores vs Tensor cores</li>\n    <li>Memory hierarchy: HBM, L2 cache, shared memory</li>\n    <li>Why GPUs accelerate matrix operations (SIMT)</li>\n    <li>Memory bandwidth vs compute bound operations</li>\n</ul>"
                        },
                        {
                            "title": "📚 Learning Resources",
                            "content": "<a href=\"https://cs231n.github.io/\" class=\"resource-link\" target=\"_blank\">📖 CS231n: CNNs for Visual Recognition</a>\n<a href=\"https://www.coursera.org/specializations/deep-learning\" class=\"resource-link\" target=\"_blank\">🎓 Deep Learning Specialization (Andrew Ng)</a>\n<a href=\"https://pytorch.org/tutorials/\" class=\"resource-link\" target=\"_blank\">💻 PyTorch Tutorials</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    },
    "transformers-llms": {
        "name": "Transformers & LLMs",
        "icon": "🧩",
        "topics": [
            {
                "id": "transformer-arch",
                "name": "Transformer Architecture",
                "description": "Attention, positional encodings, variants, and modern optimization tricks.",
                "time": "1 week",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🔄 Transformer Deep Dive",
                            "content": "<h4>Core Mechanisms</h4>\n<ul>\n    <li>Self-attention mechanism (Q, K, V matrices)</li>\n    <li>Multi-head attention - parallel attention computation</li>\n    <li>Positional encodings (absolute, relative, RoPE, ALiBi)</li>\n    <li>Feed-forward networks (FFN) with activation functions</li>\n</ul>\n<h4>Attention Variants</h4>\n<ul>\n    <li>Full self-attention (O(n²) complexity)</li>\n    <li>Sparse attention (Longformer, BigBird)</li>\n    <li>Multi-Query Attention (MQA) - shared keys/values</li>\n    <li>Grouped-Query Attention (GQA) - hybrid approach</li>\n    <li>Sliding window attention (Mistral style)</li>\n</ul>\n<h4>Optimization Techniques</h4>\n<ul>\n    <li>FlashAttention - IO-aware algorithm</li>\n    <li>PagedAttention - memory-efficient KV cache</li>\n    <li>Ring Attention - context parallelism</li>\n    <li>Attention sinks for StreamingLLM</li>\n</ul>"
                        },
                        {
                            "title": "📄 Must-Read Papers",
                            "content": "<div class=\"paper-card\">\n    <h5>Attention Is All You Need</h5>\n    <p><strong>Authors:</strong> Vaswani et al. (Google Brain)</p>\n    <p><strong>Year:</strong> 2017</p>\n    <a href=\"https://arxiv.org/abs/1706.03762\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>FlashAttention-2: Faster Attention with Better Parallelism</h5>\n    <p><strong>Authors:</strong> Tri Dao</p>\n    <p><strong>Year:</strong> 2023</p>\n    <a href=\"https://arxiv.org/abs/2307.08691\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>RoFormer: Enhanced Transformer with Rotary Position Embedding</h5>\n    <p><strong>Key concept:</strong> RoPE (used in LLaMA, GPT-NeoX)</p>\n    <a href=\"https://arxiv.org/abs/2104.09864\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "llm-pretraining",
                "name": "LLM Pre-training",
                "description": "Data, tokenization, scaling laws, and distributed training strategies.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🏗️ Pre-training at Scale",
                            "content": "<h4>Data Engineering</h4>\n<ul>\n    <li>Data curation: deduplication (MinHash, SimHash)</li>\n    <li>Quality filtering (perplexity-based, classifier-based)</li>\n    <li>Toxicity and PII removal pipelines</li>\n    <li>Code-data ratios and domain balancing</li>\n    <li>DoReMi: Domain reweighting methodology</li>\n</ul>\n<h4>Tokenization</h4>\n<ul>\n    <li>BPE (Byte-Pair Encoding) fundamentals</li>\n    <li>SentencePiece and Unigram tokenization</li>\n    <li>Byte-level BPE (GPT-2/3, LLaMA)</li>\n    <li>Vocabulary size trade-offs (32k vs 100k+)</li>\n    <li>Special tokens and chat templates</li>\n</ul>\n<h4>Scaling Laws</h4>\n<ul>\n    <li>Kaplan Scaling Laws (original)</li>\n    <li>Chinchilla: Compute-optimal training</li>\n    <li>Over-training regime (LLaMA 3: 15T tokens on 8B params)</li>\n    <li>Emergence capabilities and predictability</li>\n</ul>\n<h4>Training Dynamics</h4>\n<ul>\n    <li>3D Parallelism: Data + Tensor + Pipeline</li>\n    <li>ZeRO (Zero Redundancy Optimizer) Stages 1/2/3</li>\n    <li>FSDP (Fully Sharded Data Parallel)</li>\n    <li>Sequence Parallelism for long contexts</li>\n    <li>Mixed Precision: FP16, BF16, FP8 with Transformer Engine</li>\n</ul>"
                        },
                        {
                            "title": "📄 Essential Papers",
                            "content": "<div class=\"paper-card\">\n    <h5>Scaling Laws for Neural Language Models</h5>\n    <p><strong>Authors:</strong> Kaplan et al. (OpenAI)</p>\n    <a href=\"https://arxiv.org/abs/2001.08361\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>Training Compute-Optimal LLMs (Chinchilla)</h5>\n    <p><strong>Authors:</strong> Hoffmann et al. (DeepMind)</p>\n    <a href=\"https://arxiv.org/abs/2203.15556\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>LLaMA: Open and Efficient Foundation Models</h5>\n    <p><strong>Authors:</strong> Touvron et al. (Meta)</p>\n    <a href=\"https://arxiv.org/abs/2302.13971\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    },
    "nvidia-stack": {
        "name": "NVIDIA Stack",
        "icon": "🟢",
        "topics": [
            {
                "id": "cuda-basics",
                "name": "CUDA Programming",
                "description": "GPU architecture, CUDA programming fundamentals, and core libraries.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "⚡ CUDA Fundamentals",
                            "content": "<h4>GPU Architecture</h4>\n<ul>\n    <li>A100: 80GB HBM2e, 312 TFLOPS FP16, 7 MIG instances</li>\n    <li>H100: 80GB HBM3, 989 TFLOPS FP16, FP8 support</li>\n    <li>H200: 141GB HBM3e, 4.8 TB/s bandwidth</li>\n    <li>NVLink topology: 600 GB/s (A100) to 900 GB/s (H100)</li>\n    <li>SM (Streaming Multiprocessor) structure</li>\n    <li>Tensor Cores vs CUDA Cores</li>\n</ul>\n<h4>CUDA Programming</h4>\n<ul>\n    <li>Kernel optimization techniques</li>\n    <li>Memory coalescing for bandwidth efficiency</li>\n    <li>Shared memory usage patterns</li>\n    <li>Streams and asynchronous execution</li>\n    <li>CUDA Graphs for inference optimization</li>\n</ul>\n<h4>CUDA Libraries</h4>\n<ul>\n    <li>cuDNN: Deep Neural Network primitives</li>\n    <li>cuBLAS: GPU-accelerated BLAS</li>\n    <li>NCCL: Multi-GPU/multi-node communication</li>\n    <li>cuDF (RAPIDS): GPU DataFrames</li>\n</ul>"
                        },
                        {
                            "title": "📚 Learning Resources",
                            "content": "<a href=\"https://docs.nvidia.com/cuda/cuda-c-programming-guide/\" class=\"resource-link\" target=\"_blank\">📖 CUDA C++ Programming Guide</a>\n<a href=\"https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/\" class=\"resource-link\" target=\"_blank\">📖 CUDA Best Practices Guide</a>\n<a href=\"https://courses.nvidia.com/courses/course-v1:DLI+C-AC-01+V1/\" class=\"resource-link\" target=\"_blank\">🎓 NVIDIA DLI: Accelerated Computing</a>\n<a href=\"https://github.com/NVIDIA/cuda-samples\" class=\"resource-link\" target=\"_blank\">💻 CUDA Samples Repository</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "tensorrt",
                "name": "TensorRT & TensorRT-LLM",
                "description": "Layer fusion, quantization, in-flight batching, and multi-GPU inference.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🚀 TensorRT-LLM Optimization",
                            "content": "<h4>Core Concepts</h4>\n<ul>\n    <li>Layer fusion for reduced memory bandwidth</li>\n    <li>Precision calibration (INT8/FP8 quantization)</li>\n    <li>Dynamic shapes and batch size handling</li>\n    <li>Plugin development for custom operations</li>\n</ul>\n<h4>TensorRT-LLM Specific</h4>\n<ul>\n    <li>In-flight batching (continuous batching)</li>\n    <li>Paged Attention integration</li>\n    <li>Speculative decoding with draft models</li>\n    <li>FP8 inference on H100</li>\n    <li>Multi-GPU tensor parallelism</li>\n</ul>\n<h4>Performance Optimization</h4>\n<ul>\n    <li>KV cache quantization (INT8 for memory savings)</li>\n    <li>Prefix caching for common prompts</li>\n    <li>GEMM (matrix multiplication) optimizations</li>\n    <li>Custom CUDA kernels integration</li>\n</ul>"
                        },
                        {
                            "title": "📄 Research & Resources",
                            "content": "<div class=\"paper-card\">\n    <h5>TensorRT-LLM: A Library for Optimized LLM Inference</h5>\n    <p><strong>Key features:</strong> In-flight batching, FP8, speculative decoding</p>\n    <a href=\"https://arxiv.org/abs/2310.14585\" class=\"resource-link\" target=\"_blank\">📄 Technical Paper</a>\n</div>\n<a href=\"https://github.com/NVIDIA/TensorRT-LLM\" class=\"resource-link\" target=\"_blank\">💻 TensorRT-LLM GitHub</a>\n<a href=\"https://docs.nvidia.com/deeplearning/tensorrt/\" class=\"resource-link\" target=\"_blank\">📖 TensorRT Documentation</a>\n<a href=\"https://courses.nvidia.com/courses/course-v1:DLI+S-TX-01+V1/\" class=\"resource-link\" target=\"_blank\">🎓 DLI: TensorRT Optimization</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "nemo",
                "name": "NVIDIA NeMo Framework",
                "description": "Guardrails, data curation, customization, and retrieval for enterprise GenAI.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🎯 NeMo Framework Components",
                            "content": "<h4>NeMo Guardrails</h4>\n<ul>\n    <li>Colang syntax for defining conversation flows</li>\n    <li>Safety and containment rails</li>\n    <li>Topic boundaries and PII filtering</li>\n    <li>Integration with production LLM applications</li>\n</ul>\n<h4>NeMo Data Curator</h4>\n<ul>\n    <li>Large-scale data processing with Dask + RAPIDS</li>\n    <li>GPU-accelerated deduplication at scale</li>\n    <li>Quality filtering pipelines</li>\n    <li>Distributed processing across clusters</li>\n</ul>\n<h4>NeMo Customizer</h4>\n<ul>\n    <li>LoRA/QLoRA fine-tuning pipelines</li>\n    <li>Parameter-efficient fine-tuning (PEFT)</li>\n    <li>Multi-GPU training configurations</li>\n    <li>Checkpoint management and export</li>\n</ul>\n<h4>NeMo Retriever</h4>\n<ul>\n    <li>Embedding model training and deployment</li>\n    <li>RAG pipeline implementation</li>\n    <li>Vector database integration</li>\n    <li>Hybrid search (semantic + keyword)</li>\n</ul>"
                        },
                        {
                            "title": "📚 Resources",
                            "content": "<a href=\"https://github.com/NVIDIA/NeMo\" class=\"resource-link\" target=\"_blank\">💻 NeMo Framework GitHub</a>\n<a href=\"https://docs.nvidia.com/nemo-framework/user-guide/latest/\" class=\"resource-link\" target=\"_blank\">📖 NeMo Documentation</a>\n<a href=\"https://github.com/NVIDIA/NeMo-Guardrails\" class=\"resource-link\" target=\"_blank\">🛡️ NeMo Guardrails Repository</a>\n<a href=\"https://github.com/NVIDIA/NeMo-Curator\" class=\"resource-link\" target=\"_blank\">📊 NeMo Curator Repository</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "triton",
                "name": "Triton Inference Server",
                "description": "Serving, dynamic batching, ensembles, and Kubernetes deployment patterns.",
                "time": "1 week",
                "difficulty": "Intermediate",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🌐 Triton Inference Server",
                            "content": "<h4>Core Features</h4>\n<ul>\n    <li>Multi-framework support (TensorRT, PyTorch, ONNX, Python)</li>\n    <li>Model ensemble architecture for complex pipelines</li>\n    <li>Dynamic batching for throughput optimization</li>\n    <li>Multi-GPU and multi-node inference</li>\n    <li>gRPC and HTTP/REST API endpoints</li>\n</ul>\n<h4>Advanced Capabilities</h4>\n<ul>\n    <li>Rate limiting and request queuing</li>\n    <li>Model versioning and hot-swapping</li>\n    <li>Backend abstraction for easy model updates</li>\n    <li>Metrics export (Prometheus format)</li>\n    <li>Model Analyzer for performance profiling</li>\n</ul>\n<h4>Production Deployment</h4>\n<ul>\n    <li>Kubernetes deployment with Helm charts</li>\n    <li>Auto-scaling based on GPU utilization</li>\n    <li>Health checks and liveness probes</li>\n    <li>Load balancing across instances</li>\n</ul>"
                        },
                        {
                            "title": "📚 Resources",
                            "content": "<a href=\"https://github.com/triton-inference-server/server\" class=\"resource-link\" target=\"_blank\">💻 Triton Server GitHub</a>\n<a href=\"https://docs.nvidia.com/triton-inference-server/\" class=\"resource-link\" target=\"_blank\">📖 Triton Documentation</a>\n<a href=\"https://github.com/triton-inference-server/tutorials\" class=\"resource-link\" target=\"_blank\">🎓 Triton Tutorials</a>\n<a href=\"https://github.com/triton-inference-server/model_analyzer\" class=\"resource-link\" target=\"_blank\">📊 Model Analyzer Tool</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    },
    "k8s-infra": {
        "name": "Kubernetes & Infrastructure",
        "icon": "☸️",
        "topics": [
            {
                "id": "gpu-operator",
                "name": "NVIDIA GPU Operator",
                "description": "GPU operator components, sharing strategies, and production best practices.",
                "time": "1 week",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "☸️ GPU Operator for Kubernetes",
                            "content": "<h4>Core Components</h4>\n<ul>\n    <li>Driver Container: Automated driver installation and updates</li>\n    <li>Container Toolkit: GPU container runtime configuration</li>\n    <li>Device Plugin: Exposes GPUs to K8s scheduler</li>\n    <li>DCGM Exporter: Prometheus metrics for GPU monitoring</li>\n    <li>Node Feature Discovery (NFD): GPU capability labeling</li>\n</ul>\n<h4>GPU Sharing Strategies</h4>\n<ul>\n    <li>MIG (Multi-Instance GPU): Physical partitioning (A100/H100)</li>\n    <li>Time-Slicing: Virtual GPU for inference workloads</li>\n    <li>Mixed Strategy: MIG for QoS, Time-Slicing for best-effort</li>\n    <li>GPU topology awareness for optimal placement</li>\n</ul>\n<h4>Production Best Practices</h4>\n<ul>\n    <li>Resource requests and limits configuration</li>\n    <li>Pod disruption budgets for training jobs</li>\n    <li>Priority classes for workload prioritization</li>\n    <li>Gang scheduling for distributed training</li>\n</ul>"
                        },
                        {
                            "title": "📚 Resources",
                            "content": "<a href=\"https://github.com/NVIDIA/gpu-operator\" class=\"resource-link\" target=\"_blank\">💻 GPU Operator GitHub</a>\n<a href=\"https://docs.nvidia.com/gpu-operator/gpu-operator-latest/\" class=\"resource-link\" target=\"_blank\">📖 GPU Operator Documentation</a>\n<a href=\"https://docs.nvidia.com/datacenter/tesla/mig-user-guide/\" class=\"resource-link\" target=\"_blank\">📖 MIG User Guide</a>\n<a href=\"https://courses.nvidia.com/courses/course-v1:DLI+S-K8S-01+V1/\" class=\"resource-link\" target=\"_blank\">🎓 DLI: Scaling Workloads with K8s</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "monitoring",
                "name": "GPU Monitoring & Observability",
                "description": "DCGM metrics, Nsight profiling, and observability tools for LLM apps.",
                "time": "1 week",
                "difficulty": "Intermediate",
                "content": {
                    "keyPoints": [
                        {
                            "title": "📊 GPU Monitoring Stack",
                            "content": "<h4>DCGM (Data Center GPU Manager)</h4>\n<ul>\n    <li>GPU utilization (compute, memory, tensor cores)</li>\n    <li>Temperature and power consumption</li>\n    <li>Memory bandwidth utilization</li>\n    <li>XID errors (critical GPU faults)</li>\n    <li>ECC errors and memory remapping</li>\n    <li>NVLink flits (inter-GPU communication)</li>\n</ul>\n<h4>Profiling Tools</h4>\n<ul>\n    <li>Nsight Systems: Timeline analysis, kernel execution, NCCL collectives</li>\n    <li>Nsight Compute: Kernel-level analysis, occupancy, warp stalls</li>\n    <li>Memory coalescing efficiency</li>\n    <li>Roofline analysis for performance bounds</li>\n</ul>\n<h4>Observability Stack</h4>\n<ul>\n    <li>Prometheus + Grafana for GPU dashboards</li>\n    <li>Triton Model Analyzer for inference profiling</li>\n    <li>LangSmith/Langfuse for LLM chain tracing</li>\n    <li>Evidently AI for data drift detection</li>\n</ul>"
                        },
                        {
                            "title": "📚 Resources",
                            "content": "<a href=\"https://developer.nvidia.com/dcgm\" class=\"resource-link\" target=\"_blank\">📖 DCGM Documentation</a>\n<a href=\"https://github.com/NVIDIA/dcgm-exporter\" class=\"resource-link\" target=\"_blank\">💻 DCGM Exporter (Prometheus)</a>\n<a href=\"https://developer.nvidia.com/nsight-systems\" class=\"resource-link\" target=\"_blank\">🔍 Nsight Systems</a>\n<a href=\"https://developer.nvidia.com/nsight-compute\" class=\"resource-link\" target=\"_blank\">🔍 Nsight Compute</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    },
    "inference-optimization": {
        "name": "Inference Optimization",
        "icon": "🚀",
        "topics": [
            {
                "id": "quantization",
                "name": "Quantization Techniques",
                "description": "PTQ methods, precision formats, and trade-offs.",
                "time": "1 week",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🎯 Quantization Methods",
                            "content": "<h4>Post-Training Quantization (PTQ)</h4>\n<ul>\n    <li>GPTQ: Layer-wise optimal quantization</li>\n    <li>AWQ: Activation-aware weight quantization (protects salient weights)</li>\n    <li>GGUF/GGML: CPU+GPU hybrid inference (llama.cpp)</li>\n    <li>SmoothQuant: Migrates difficulty from activations to weights</li>\n    <li>HQQ: Half-Quadratic Quantization (fast, data-free)</li>\n</ul>\n<h4>Precision Formats</h4>\n<ul>\n    <li>FP16, BF16: Training precision</li>\n    <li>INT8, INT4: Inference precision</li>\n    <li>FP8 (H100/H200): E4M3 and E5M2 formats</li>\n    <li>NormalFloat (NF4): Used in QLoRA</li>\n</ul>\n<h4>Impact Analysis</h4>\n<ul>\n    <li>FP16 → INT8: 2x memory reduction, ~1.5x speedup</li>\n    <li>INT4/AWQ: 4x memory reduction, enables larger batch sizes</li>\n    <li>FP8 on H100: No accuracy loss, hardware-native support</li>\n</ul>"
                        },
                        {
                            "title": "📄 Key Papers & Repos",
                            "content": "<div class=\"paper-card\">\n    <h5>GPTQ: Accurate Quantization for Generative Models</h5>\n    <a href=\"https://arxiv.org/abs/2210.17323\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>AWQ: Activation-aware Weight Quantization</h5>\n    <a href=\"https://arxiv.org/abs/2306.00978\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>FP8 Formats for Deep Learning</h5>\n    <p><strong>NVIDIA's FP8 standard</strong></p>\n    <a href=\"https://arxiv.org/abs/2209.05433\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<a href=\"https://github.com/mit-han-lab/llm-awq\" class=\"resource-link\" target=\"_blank\">💻 AWQ GitHub</a>\n<a href=\"https://github.com/AutoGPTQ/AutoGPTQ\" class=\"resource-link\" target=\"_blank\">💻 AutoGPTQ Repository</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "serving",
                "name": "Efficient Serving",
                "description": "vLLM, TensorRT-LLM, additional engines + optimizations.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🚀 Inference Engines",
                            "content": "<h4>vLLM (PagedAttention)</h4>\n<ul>\n    <li>Block-based memory management for KV cache</li>\n    <li>Continuous batching (in-flight batching)</li>\n    <li>2-4x throughput vs static batching</li>\n    <li>OpenAI-compatible API</li>\n    <li>Prefix caching for shared prompts</li>\n</ul>\n<h4>TensorRT-LLM</h4>\n<ul>\n    <li>NVIDIA-optimized inference</li>\n    <li>FP8 support on H100</li>\n    <li>In-flight batching + paged attention</li>\n    <li>Speculative decoding integration</li>\n    <li>Multi-GPU tensor parallelism</li>\n</ul>\n<h4>Additional Engines</h4>\n<ul>\n    <li>TGI (Text Generation Inference): HuggingFace ecosystem</li>\n    <li>llama.cpp: Edge/mobile deployment (GGUF format)</li>\n    <li>SGLang: Structured generation (JSON schema enforcement)</li>\n    <li>MLC LLM: Universal deployment (TVM backend)</li>\n</ul>\n<h4>Optimization Techniques</h4>\n<ul>\n    <li>Chunked prefill: Interleave prefill/decode phases</li>\n    <li>KV cache offloading to CPU RAM</li>\n    <li>Context parallelism (Ring Attention)</li>\n    <li>Speculative decoding (draft-then-verify)</li>\n</ul>"
                        },
                        {
                            "title": "📄 Research & Repos",
                            "content": "<div class=\"paper-card\">\n    <h5>Efficient Memory Management for LLM Serving (PagedAttention)</h5>\n    <a href=\"https://arxiv.org/abs/2309.06180\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>Speculative Decoding</h5>\n    <p><strong>Draft-then-verify for 2-3x speedup</strong></p>\n    <a href=\"https://arxiv.org/abs/2211.17192\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<a href=\"https://github.com/vllm-project/vllm\" class=\"resource-link\" target=\"_blank\">💻 vLLM GitHub</a>\n<a href=\"https://github.com/huggingface/text-generation-inference\" class=\"resource-link\" target=\"_blank\">💻 Text Generation Inference</a>\n<a href=\"https://github.com/sgl-project/sglang\" class=\"resource-link\" target=\"_blank\">💻 SGLang Repository</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    },
    "rag-agents": {
        "name": "RAG & Agents",
        "icon": "🤖",
        "topics": [
            {
                "id": "rag-systems",
                "name": "RAG Architecture",
                "description": "Retrieval, reranking, chunking, and evaluation metrics.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🔍 Retrieval-Augmented Generation",
                            "content": "<h4>Core Components</h4>\n<ul>\n    <li>Embedding models: OpenAI, Cohere, E5, BGE</li>\n    <li>Vector databases: Milvus, Pinecone, pgvector, Weaviate</li>\n    <li>Chunking strategies: Fixed, semantic, recursive</li>\n    <li>Retrieval methods: Dense, sparse, hybrid</li>\n    <li>Reranking: Cohere Rerank, BGE-Reranker</li>\n</ul>\n<h4>Advanced Techniques</h4>\n<ul>\n    <li>HyDE: Hypothetical Document Embedding</li>\n    <li>Query transformation and expansion</li>\n    <li>Max Marginal Relevance (MMR) for diversity</li>\n    <li>Parent-child chunking for context preservation</li>\n    <li>Metadata filtering and structured queries</li>\n</ul>\n<h4>Evaluation Metrics</h4>\n<ul>\n    <li>Faithfulness: Answer grounded in context</li>\n    <li>Answer Relevance: Semantic similarity to question</li>\n    <li>Context Precision: Relevant chunks retrieved</li>\n    <li>Context Recall: All relevant info retrieved</li>\n    <li>Citation accuracy and verification</li>\n</ul>"
                        },
                        {
                            "title": "📄 Research & Tools",
                            "content": "<div class=\"paper-card\">\n    <h5>RAGAS: Automated Evaluation of RAG</h5>\n    <a href=\"https://arxiv.org/abs/2309.15217\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>Self-RAG: Learning to Retrieve on Demand</h5>\n    <a href=\"https://arxiv.org/abs/2310.11511\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<a href=\"https://docs.ragas.io/\" class=\"resource-link\" target=\"_blank\">📖 RAGAS Documentation</a>\n<a href=\"https://github.com/Arize-ai/phoenix\" class=\"resource-link\" target=\"_blank\">💻 Arize Phoenix (RAG Evaluation)</a>\n<a href=\"https://docs.llamaindex.ai/\" class=\"resource-link\" target=\"_blank\">📖 LlamaIndex Documentation</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "agentic-frameworks",
                "name": "Agentic AI Frameworks",
                "description": "LangGraph, AutoGen, CrewAI and common agent workflow patterns.",
                "time": "2 weeks",
                "difficulty": "Advanced",
                "content": {
                    "keyPoints": [
                        {
                            "title": "🤖 Agent Frameworks",
                            "content": "<h4>LangGraph (State Machines)</h4>\n<ul>\n    <li>Cyclic graph workflows (vs linear chains)</li>\n    <li>State persistence across turns</li>\n    <li>Human-in-the-loop approvals</li>\n    <li>Conditional routing based on outputs</li>\n</ul>\n<h4>AutoGen (Multi-Agent)</h4>\n<ul>\n    <li>Role-based agent conversations</li>\n    <li>User proxy for human interaction</li>\n    <li>Code execution in sandboxed environments</li>\n    <li>Critic agents for self-improvement</li>\n</ul>\n<h4>CrewAI</h4>\n<ul>\n    <li>Hierarchical task decomposition</li>\n    <li>Agent specialization (CEO, researcher, writer)</li>\n    <li>Sequential vs parallel execution</li>\n    <li>LangChain tools integration</li>\n</ul>\n<h4>Workflow Patterns</h4>\n<ul>\n    <li>ReAct: Thought → Action → Observation loops</li>\n    <li>Plan-and-Solve: Decompose → Execute → Synthesize</li>\n    <li>Reflection: Self-critique and revision</li>\n    <li>Multi-Agent Debate: Consensus through argumentation</li>\n</ul>"
                        },
                        {
                            "title": "📄 Papers & Resources",
                            "content": "<div class=\"paper-card\">\n    <h5>ReAct: Synergizing Reasoning and Acting</h5>\n    <a href=\"https://arxiv.org/abs/2210.03629\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<div class=\"paper-card\">\n    <h5>Reflexion: Self-Reflective Agents</h5>\n    <a href=\"https://arxiv.org/abs/2303.11366\" class=\"resource-link\" target=\"_blank\">📄 Read Paper</a>\n</div>\n<a href=\"https://langchain-ai.github.io/langgraph/\" class=\"resource-link\" target=\"_blank\">📖 LangGraph Documentation</a>\n<a href=\"https://github.com/microsoft/autogen\" class=\"resource-link\" target=\"_blank\">💻 AutoGen GitHub</a>\n<a href=\"https://docs.crewai.com/\" class=\"resource-link\" target=\"_blank\">📖 CrewAI Documentation</a>\n<a href=\"https://www.deeplearning.ai/short-courses/langgraph/\" class=\"resource-link\" target=\"_blank\">🎓 DeepLearning.AI: LangGraph Course</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    },
    "cloud-platforms": {
        "name": "Cloud Platforms",
        "icon": "☁️",
        "topics": [
            {
                "id": "vertex-ai",
                "name": "Google Vertex AI Agents",
                "description": "Agent Builder, Vertex AI Search, and enterprise RAG patterns.",
                "time": "1 week",
                "difficulty": "Intermediate",
                "content": {
                    "keyPoints": [
                        {
                            "title": "☁️ Vertex AI Agent Builder",
                            "content": "<h4>Core Components</h4>\n<ul>\n    <li>Data Stores: BigQuery, Cloud Storage, website connectors</li>\n    <li>Playbooks: Deterministic conversation flows</li>\n    <li>Tools: Extensions (API calls), Functions (client-side)</li>\n    <li>Grounding: Google Search integration</li>\n</ul>\n<h4>Vertex AI Search</h4>\n<ul>\n    <li>Enterprise RAG with citation generation</li>\n    <li>Chunking strategies: Fixed, semantic, custom</li>\n    <li>ScaNN algorithm for billion-scale vector search</li>\n    <li>LlamaIndex integration support</li>\n</ul>\n<h4>Specialized Features</h4>\n<ul>\n    <li>Civic Answers: Pre-built for government/finance</li>\n    <li>Dialogflow CX integration for voice bots</li>\n    <li>Extensions via OpenAPI specifications</li>\n</ul>"
                        },
                        {
                            "title": "📚 Resources",
                            "content": "<a href=\"https://cloud.google.com/generative-ai-app-builder/docs/agent-builder-intro\" class=\"resource-link\" target=\"_blank\">📖 Agent Builder Documentation</a>\n<a href=\"https://www.cloudskillsboost.google/course_templates/946\" class=\"resource-link\" target=\"_blank\">🎓 Vertex AI Agents Course</a>\n<a href=\"https://github.com/GoogleCloudPlatform/vertex-ai-samples\" class=\"resource-link\" target=\"_blank\">💻 Vertex AI Samples</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            },
            {
                "id": "bedrock",
                "name": "AWS Bedrock Agents",
                "description": "Agents, action groups, knowledge bases, and monitoring patterns.",
                "time": "1 week",
                "difficulty": "Intermediate",
                "content": {
                    "keyPoints": [
                        {
                            "title": "☁️ Amazon Bedrock Agents",
                            "content": "<h4>Core Architecture</h4>\n<ul>\n    <li>Action Groups: OpenAPI schema → Lambda functions</li>\n    <li>Knowledge Bases: Aurora PostgreSQL (pgvector) or OpenSearch</li>\n    <li>Prompt Templates: Pre/post processing hooks</li>\n    <li>Session State: DynamoDB for conversation persistence</li>\n</ul>\n<h4>Optimization Features</h4>\n<ul>\n    <li>Provisioned Throughput: Guaranteed capacity (not On-Demand)</li>\n    <li>Model Customization: Continued Pre-training + Fine-tuning</li>\n    <li>Inference Profiles: Cross-region for latency optimization</li>\n    <li>Guardrails: Content filtering and PII detection</li>\n</ul>\n<h4>Integration Patterns</h4>\n<ul>\n    <li>SageMaker: Custom model hosting alongside Bedrock</li>\n    <li>Amazon Kendra: Enterprise search integration</li>\n    <li>AWS Step Functions: Multi-agent orchestration</li>\n    <li>CloudWatch: Native monitoring and alerts</li>\n</ul>"
                        },
                        {
                            "title": "📚 Resources",
                            "content": "<a href=\"https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html\" class=\"resource-link\" target=\"_blank\">📖 Bedrock Agents Documentation</a>\n<a href=\"https://github.com/aws-samples/amazon-bedrock-workshop\" class=\"resource-link\" target=\"_blank\">💻 Bedrock Workshop</a>\n<a href=\"https://skillbuilder.aws/\" class=\"resource-link\" target=\"_blank\">🎓 AWS Skill Builder</a>"
                        }
                    ],
                    "examples": [],
                    "warnings": []
                }
            }
        ]
    }
};
