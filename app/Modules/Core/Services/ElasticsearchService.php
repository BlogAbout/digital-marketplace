<?php

namespace App\Modules\Core\Services;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Support\Facades\Log;

class ElasticsearchService
{
    /**
     * @var Client
     */
    protected Client $client;

    /**
     * @var string
     */
    protected string $indexPrefix;

    public function __construct()
    {
        $host = config('elasticsearch.host', 'elasticsearch');
        $port = config('elasticsearch.port', 9200);

        $this->client = ClientBuilder::create()
            ->setHosts(["{$host}:{$port}"])
            ->build();

        $this->indexPrefix = config('elasticsearch.prefix', 'marketplace');
    }

    /**
     * Получить клиент Elasticsearch
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * Получить полное имя индекса
     */
    public function getIndexName(string $type): string
    {
        return "{$this->indexPrefix}_{$type}";
    }

    /**
     * Проверить существование индекса
     */
    public function indexExists(string $type): bool
    {
        $indexName = $this->getIndexName($type);

        try {
            return $this->client->indices()->exists(['index' => $indexName])->asBool();
        } catch (\Exception $e) {
            Log::error('Elasticsearch index check failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Создать индекс
     *
     * @param array<string, mixed> $settings
     */
    public function createIndex(string $type, array $settings = []): bool
    {
        $indexName = $this->getIndexName($type);

        try {
            if ($this->indexExists($type)) {
                return true;
            }

            $params = [
                'index' => $indexName,
                'body' => [
                    'settings' => array_merge([
                        'number_of_shards' => 1,
                        'number_of_replicas' => 0,
                        'analysis' => [
                            'analyzer' => [
                                'russian' => [
                                    'type' => 'custom',
                                    'tokenizer' => 'standard',
                                    'filter' => ['lowercase', 'russian_morphology'],
                                ],
                                'english' => [
                                    'type' => 'custom',
                                    'tokenizer' => 'standard',
                                    'filter' => ['lowercase', 'english_stemmer'],
                                ],
                            ],
                            'filter' => [
                                'russian_morphology' => [
                                    'type' => 'hunspell',
                                    'locale' => 'ru_RU',
                                ],
                                'english_stemmer' => [
                                    'type' => 'stemmer',
                                    'language' => 'english',
                                ],
                            ],
                        ],
                    ], $settings),
                ],
            ];

            $this->client->indices()->create($params);
            return true;
        } catch (\Exception $e) {
            Log::error('Elasticsearch index creation failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Удалить индекс
     */
    public function deleteIndex(string $type): bool
    {
        $indexName = $this->getIndexName($type);

        try {
            if (!$this->indexExists($type)) {
                return true;
            }

            $this->client->indices()->delete(['index' => $indexName]);
            return true;
        } catch (\Exception $e) {
            Log::error('Elasticsearch index deletion failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Индексировать документ
     *
     * @param array<string, mixed> $body
     */
    public function indexDocument(string $type, string $id, array $body): bool
    {
        $indexName = $this->getIndexName($type);

        try {
            $this->client->index([
                'index' => $indexName,
                'id' => $id,
                'body' => $body,
            ]);
            return true;
        } catch (\Exception $e) {
            Log::error('Elasticsearch document indexing failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Обновить документ
     *
     * @param array<string, mixed> $body
     */
    public function updateDocument(string $type, string $id, array $body): bool
    {
        $indexName = $this->getIndexName($type);

        try {
            $this->client->update([
                'index' => $indexName,
                'id' => $id,
                'body' => [
                    'doc' => $body,
                ],
            ]);
            return true;
        } catch (\Exception $e) {
            Log::error('Elasticsearch document update failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Удалить документ
     */
    public function deleteDocument(string $type, string $id): bool
    {
        $indexName = $this->getIndexName($type);

        try {
            $this->client->delete([
                'index' => $indexName,
                'id' => $id,
            ]);
            return true;
        } catch (\Exception $e) {
            Log::error('Elasticsearch document deletion failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Поиск по индексу
     *
     * @param array<string, mixed> $query
     * @return array<string, mixed>
     */
    public function search(string $type, array $query, int $from = 0, int $size = 20): array
    {
        $indexName = $this->getIndexName($type);

        try {
            $response = $this->client->search([
                'index' => $indexName,
                'from' => $from,
                'size' => $size,
                'body' => $query,
            ]);

            return $response->asArray();
        } catch (\Exception $e) {
            Log::error('Elasticsearch search failed: ' . $e->getMessage());
            return [
                'hits' => [
                    'total' => ['value' => 0],
                    'hits' => [],
                ],
            ];
        }
    }

    /**
     * Мультипоиск по нескольким индексам
     *
     * @param array<string, mixed> $query
     * @return array<string, mixed>
     */
    public function multiSearch(array $types, array $query, int $from = 0, int $size = 20): array
    {
        $indices = array_map(function ($type) {
            return $this->getIndexName($type);
        }, $types);

        try {
            $response = $this->client->search([
                'index' => implode(',', $indices),
                'from' => $from,
                'size' => $size,
                'body' => $query,
            ]);

            return $response->asArray();
        } catch (\Exception $e) {
            Log::error('Elasticsearch multi-search failed: ' . $e->getMessage());
            return [
                'hits' => [
                    'total' => ['value' => 0],
                    'hits' => [],
                ],
            ];
        }
    }
}
