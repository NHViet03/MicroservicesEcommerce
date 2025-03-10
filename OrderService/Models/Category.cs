﻿using MongoDB.Bson.Serialization.Attributes;

namespace OrderService.Models
{
    public class Category
    {
        [BsonId]
        public string? Id { get; set; } = Guid.NewGuid().ToString();

        public string? Name { get; set; }
    }
}
