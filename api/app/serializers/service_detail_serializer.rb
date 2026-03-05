class ServiceDetailSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :description,
             :price,
             :duration_minutes
end