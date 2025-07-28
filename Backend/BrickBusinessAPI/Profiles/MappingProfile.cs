using AutoMapper;
using BrickBusinessAPI.Models;
using BrickBusinessAPI.DTOs;

namespace BrickBusinessAPI.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // Item mappings
            CreateMap<Item, ItemDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
            CreateMap<CreateItemDto, Item>();
            CreateMap<UpdateItemDto, Item>();

            // Sale mappings
            CreateMap<Sale, SaleDto>();
            CreateMap<CreateSaleDto, Sale>()
                .ForMember(dest => dest.SaleItems, opt => opt.Ignore())
                .ForMember(dest => dest.TransportLog, opt => opt.Ignore());

            // SaleItem mappings
            CreateMap<SaleItem, SaleItemDto>()
                .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => src.Item.Name));
            CreateMap<CreateSaleItemDto, SaleItem>();

            // TransportLog mappings
            CreateMap<TransportLog, TransportLogDto>();
            CreateMap<CreateTransportLogDto, TransportLog>();
        }
    }
}
